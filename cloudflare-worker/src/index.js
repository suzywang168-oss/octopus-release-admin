const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 120000;

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS || '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, '') || '/';

      if (path === '/' || path === '/api/health') {
        const row = await env.DB.prepare('SELECT 1 AS ok').first();
        return json({ ok: true, service: 'octopus-release-api', database: row?.ok === 1 ? 'connected' : 'unknown', request_id: requestId }, 200, cors);
      }

      if (path === '/api/auth/register' && request.method === 'POST') {
        return await register(request, env, cors, requestId);
      }
      if (path === '/api/auth/login' && request.method === 'POST') {
        return await login(request, env, cors, requestId);
      }

      const auth = await authenticate(request, env);
      if (!auth) return json({ ok: false, error: 'UNAUTHORIZED', message: '登录已失效，请重新登录。', request_id: requestId }, 401, cors);

      if (path === '/api/auth/me' && request.method === 'GET') {
        return json({ ok: true, data: auth.public, request_id: requestId }, 200, cors);
      }
      if (path === '/api/auth/logout' && request.method === 'POST') {
        await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(auth.sessionId).run();
        return json({ ok: true, request_id: requestId }, 200, cors);
      }
      if (path === '/api/bootstrap' && request.method === 'POST') {
        return await bootstrapDemo(auth, env, cors, requestId);
      }

      if (path === '/api/projects' && request.method === 'GET') return await listProjects(url, auth, env, cors, requestId);
      if (path === '/api/projects' && request.method === 'POST') return await createProject(request, auth, env, cors, requestId);
      const projectMatch = path.match(/^\/api\/projects\/([^/]+)$/);
      if (projectMatch) {
        if (request.method === 'GET') return await getProject(projectMatch[1], auth, env, cors, requestId);
        if (request.method === 'PUT' || request.method === 'PATCH') return await updateProject(projectMatch[1], request, auth, env, cors, requestId);
        if (request.method === 'DELETE') return await archiveProject(projectMatch[1], request, auth, env, cors, requestId);
      }

      if (path === '/api/records' && request.method === 'GET') return await listRecords(url, auth, env, cors, requestId);
      if (path === '/api/records' && request.method === 'POST') return await createRecord(request, auth, env, cors, requestId);
      const recordMatch = path.match(/^\/api\/records\/([^/]+)$/);
      if (recordMatch) {
        if (request.method === 'GET') return await getRecord(recordMatch[1], auth, env, cors, requestId);
        if (request.method === 'PUT' || request.method === 'PATCH') return await updateRecord(recordMatch[1], request, auth, env, cors, requestId);
        if (request.method === 'DELETE') return await removeRecord(recordMatch[1], request, auth, env, cors, requestId);
      }
      const actionMatch = path.match(/^\/api\/records\/([^/]+)\/actions$/);
      if (actionMatch && request.method === 'POST') return await recordAction(actionMatch[1], request, auth, env, cors, requestId);
      if (path === '/api/audit-logs' && request.method === 'GET') return await listAuditLogs(url, auth, env, cors, requestId);

      return json({ ok: false, error: 'NOT_FOUND', message: '接口不存在。', request_id: requestId }, 404, cors);
    } catch (error) {
      console.error('request_failed', requestId, error);
      return json({ ok: false, error: 'INTERNAL_ERROR', message: '服务暂时不可用。', request_id: requestId }, 500, cors);
    }
  },
};

async function register(request, env, cors, requestId) {
  const body = await readJson(request);
  const name = clean(body.name, 100);
  const contact = normalizeContact(body.contact);
  const contactType = body.contact_type === 'phone' ? 'phone' : 'email';
  const password = String(body.password || '');
  const company = clean(body.company, 160);
  const companyType = clean(body.company_type || '内容制作方', 80);
  const region = clean(body.region || '', 80);
  const role = clean(body.role || 'producer_admin', 80);

  if (!name || !contact || !company || password.length < 8) {
    return json({ ok: false, error: 'VALIDATION_ERROR', message: '请完整填写姓名、账号、企业和至少 8 位密码。', request_id: requestId }, 422, cors);
  }

  const existing = await env.DB.prepare('SELECT id FROM users WHERE contact = ?').bind(contact).first();
  if (existing) return json({ ok: false, error: 'CONTACT_EXISTS', message: '该账号已注册。', request_id: requestId }, 409, cors);

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const orgId = crypto.randomUUID();
  const memberId = crypto.randomUUID();
  const { hash, salt } = await hashPassword(password);

  await env.DB.batch([
    env.DB.prepare(`INSERT INTO organizations (id,name,type,region,plan,status,settings_json,created_at,updated_at)
      VALUES (?,?,?,?,?,'active','{}',?,?)`).bind(orgId, company, companyType, region, 'partner', now, now),
    env.DB.prepare(`INSERT INTO users (id,name,contact,contact_type,password_hash,password_salt,status,created_at,updated_at)
      VALUES (?,?,?,?,?,?,'active',?,?)`).bind(userId, name, contact, contactType, hash, salt, now, now),
    env.DB.prepare(`INSERT INTO memberships (id,organization_id,user_id,role,permissions_json,status,created_at,updated_at)
      VALUES (?,?,?,?,?,'active',?,?)`).bind(memberId, orgId, userId, role, '["*"]', now, now),
  ]);

  const session = await issueSession(userId, orgId, request, env);
  await audit(env, { orgId, userId, entityType: 'organization', entityId: orgId, action: 'register', after: { name: company, type: companyType }, requestId });
  return json({ ok: true, data: { token: session.token, user: { id: userId, name, contact }, organization: { id: orgId, name: company, type: companyType }, role }, request_id: requestId }, 201, cors);
}

async function login(request, env, cors, requestId) {
  const body = await readJson(request);
  const contact = normalizeContact(body.contact);
  const password = String(body.password || '');
  if (!contact || !password) return json({ ok: false, error: 'VALIDATION_ERROR', message: '请输入账号和密码。', request_id: requestId }, 422, cors);

  let row = await env.DB.prepare(`SELECT u.id AS user_id,u.name,u.contact,u.password_hash,u.password_salt,
      o.id AS organization_id,o.name AS organization_name,o.type AS organization_type,m.role
    FROM users u
    JOIN memberships m ON m.user_id=u.id AND m.status='active'
    JOIN organizations o ON o.id=m.organization_id AND o.status='active'
    WHERE u.contact=? AND u.status='active'
    ORDER BY m.created_at ASC LIMIT 1`).bind(contact).first();

  if (!row && env.ALLOW_DEMO === 'true' && contact === 'suzy@octopus.cloud' && password === 'Octopus2026!') {
    await createDemoTenant(env);
    row = await env.DB.prepare(`SELECT u.id AS user_id,u.name,u.contact,u.password_hash,u.password_salt,
        o.id AS organization_id,o.name AS organization_name,o.type AS organization_type,m.role
      FROM users u JOIN memberships m ON m.user_id=u.id JOIN organizations o ON o.id=m.organization_id
      WHERE u.contact=? LIMIT 1`).bind(contact).first();
  }

  if (!row || !(await verifyPassword(password, row.password_salt, row.password_hash))) {
    return json({ ok: false, error: 'INVALID_CREDENTIALS', message: '账号或密码错误。', request_id: requestId }, 401, cors);
  }

  const session = await issueSession(row.user_id, row.organization_id, request, env);
  await audit(env, { orgId: row.organization_id, userId: row.user_id, entityType: 'session', entityId: session.sessionId, action: 'login', requestId });
  return json({ ok: true, data: { token: session.token, user: { id: row.user_id, name: row.name, contact: row.contact }, organization: { id: row.organization_id, name: row.organization_name, type: row.organization_type }, role: row.role }, request_id: requestId }, 200, cors);
}

async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return null;
  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const row = await env.DB.prepare(`SELECT s.id AS session_id,s.user_id,s.organization_id,s.expires_at,
      u.name,u.contact,o.name AS organization_name,o.type AS organization_type,m.role,m.permissions_json
    FROM sessions s
    JOIN users u ON u.id=s.user_id AND u.status='active'
    JOIN organizations o ON o.id=s.organization_id AND o.status='active'
    JOIN memberships m ON m.user_id=s.user_id AND m.organization_id=s.organization_id AND m.status='active'
    WHERE s.token_hash=? AND s.expires_at>? LIMIT 1`).bind(tokenHash, now).first();
  if (!row) return null;
  await env.DB.prepare('UPDATE sessions SET last_seen_at=? WHERE id=?').bind(now, row.session_id).run();
  return {
    sessionId: row.session_id,
    userId: row.user_id,
    orgId: row.organization_id,
    role: row.role,
    permissions: safeJson(row.permissions_json, []),
    public: {
      user: { id: row.user_id, name: row.name, contact: row.contact },
      organization: { id: row.organization_id, name: row.organization_name, type: row.organization_type },
      role: row.role,
      permissions: safeJson(row.permissions_json, []),
    },
  };
}

async function listProjects(url, auth, env, cors, requestId) {
  const status = clean(url.searchParams.get('status') || '', 40);
  const q = clean(url.searchParams.get('q') || '', 120);
  const page = clampInt(url.searchParams.get('page'), 1, 100000, 1);
  const pageSize = clampInt(url.searchParams.get('page_size'), 1, 100, 30);
  const offset = (page - 1) * pageSize;
  const filters = ['organization_id=?', 'archived_at IS NULL'];
  const binds = [auth.orgId];
  if (status) { filters.push('status=?'); binds.push(status); }
  if (q) { filters.push('(name LIKE ? OR code LIKE ?)'); binds.push(`%${q}%`, `%${q}%`); }
  const where = filters.join(' AND ');
  const [rows, count] = await Promise.all([
    env.DB.prepare(`SELECT * FROM projects WHERE ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`).bind(...binds, pageSize, offset).all(),
    env.DB.prepare(`SELECT COUNT(*) AS total FROM projects WHERE ${where}`).bind(...binds).first(),
  ]);
  return json({ ok: true, data: rows.results.map(mapProject), pagination: { page, page_size: pageSize, total: count?.total || 0 }, request_id: requestId }, 200, cors);
}

async function createProject(request, auth, env, cors, requestId) {
  const body = await readJson(request);
  const name = clean(body.name || body.projectName || body.title, 180);
  if (!name) return json({ ok: false, error: 'VALIDATION_ERROR', message: '项目名称不能为空。', request_id: requestId }, 422, cors);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const code = clean(body.code || body.projectCode || `OCT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, 60);
  const payload = body.payload || body.data || body;
  await env.DB.prepare(`INSERT INTO projects (id,organization_id,code,name,format,episode_count,source_language,owner_name,status,current_stage,payload_json,version,created_by,updated_by,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      id, auth.orgId, code, name, clean(body.format, 80), numberOrNull(body.episode_count ?? body.episodes), clean(body.source_language ?? body.sourceLang, 40), clean(body.owner_name ?? body.owner, 100), clean(body.status || 'draft', 40), clean(body.current_stage || 'overview', 80), JSON.stringify(payload), 1, auth.userId, auth.userId, now, now,
    ).run();
  const project = await env.DB.prepare('SELECT * FROM projects WHERE id=?').bind(id).first();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'project', entityId: id, action: 'create', after: mapProject(project), requestId });
  return json({ ok: true, data: mapProject(project), request_id: requestId }, 201, cors);
}

async function getProject(id, auth, env, cors, requestId) {
  const row = await env.DB.prepare('SELECT * FROM projects WHERE id=? AND organization_id=?').bind(id, auth.orgId).first();
  if (!row) return notFound(cors, requestId);
  const counts = await env.DB.prepare(`SELECT module,COUNT(*) AS count FROM records WHERE project_id=? AND organization_id=? AND archived_at IS NULL GROUP BY module`).bind(id, auth.orgId).all();
  return json({ ok: true, data: { ...mapProject(row), module_counts: counts.results }, request_id: requestId }, 200, cors);
}

async function updateProject(id, request, auth, env, cors, requestId) {
  const before = await env.DB.prepare('SELECT * FROM projects WHERE id=? AND organization_id=?').bind(id, auth.orgId).first();
  if (!before) return notFound(cors, requestId);
  const body = await readJson(request);
  const payload = { ...safeJson(before.payload_json, {}), ...(body.payload || body.data || {}) };
  const now = new Date().toISOString();
  await env.DB.prepare(`UPDATE projects SET name=?,format=?,episode_count=?,source_language=?,owner_name=?,status=?,current_stage=?,payload_json=?,version=version+1,updated_by=?,updated_at=? WHERE id=? AND organization_id=?`).bind(
    clean(body.name ?? before.name, 180), clean(body.format ?? before.format, 80), numberOrNull(body.episode_count ?? before.episode_count), clean(body.source_language ?? before.source_language, 40), clean(body.owner_name ?? before.owner_name, 100), clean(body.status ?? before.status, 40), clean(body.current_stage ?? before.current_stage, 80), JSON.stringify(payload), auth.userId, now, id, auth.orgId,
  ).run();
  const after = await env.DB.prepare('SELECT * FROM projects WHERE id=?').bind(id).first();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'project', entityId: id, action: 'update', before: mapProject(before), after: mapProject(after), reason: clean(body.reason, 400), requestId });
  return json({ ok: true, data: mapProject(after), request_id: requestId }, 200, cors);
}

async function archiveProject(id, request, auth, env, cors, requestId) {
  const before = await env.DB.prepare('SELECT * FROM projects WHERE id=? AND organization_id=?').bind(id, auth.orgId).first();
  if (!before) return notFound(cors, requestId);
  const body = await readJson(request, true);
  const now = new Date().toISOString();
  await env.DB.prepare(`UPDATE projects SET status='archived',archived_at=?,version=version+1,updated_by=?,updated_at=? WHERE id=? AND organization_id=?`).bind(now, auth.userId, now, id, auth.orgId).run();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'project', entityId: id, action: 'archive', before: mapProject(before), reason: clean(body.reason, 400), requestId });
  return json({ ok: true, data: { id, status: 'archived' }, request_id: requestId }, 200, cors);
}

async function listRecords(url, auth, env, cors, requestId) {
  const module = clean(url.searchParams.get('module') || '', 100);
  const projectId = clean(url.searchParams.get('project_id') || '', 80);
  const status = clean(url.searchParams.get('status') || '', 40);
  const q = clean(url.searchParams.get('q') || '', 120);
  const page = clampInt(url.searchParams.get('page'), 1, 100000, 1);
  const pageSize = clampInt(url.searchParams.get('page_size'), 1, 100, 30);
  const offset = (page - 1) * pageSize;
  const filters = ['r.organization_id=?', 'r.archived_at IS NULL'];
  const binds = [auth.orgId];
  if (module) { filters.push('r.module=?'); binds.push(module); }
  if (projectId) { filters.push('r.project_id=?'); binds.push(projectId); }
  if (status) { filters.push('r.status=?'); binds.push(status); }
  if (q) { filters.push('(r.title LIKE ? OR r.owner_name LIKE ?)'); binds.push(`%${q}%`, `%${q}%`); }
  const where = filters.join(' AND ');
  const [rows, count] = await Promise.all([
    env.DB.prepare(`SELECT r.*,p.name AS project_name,p.code AS project_code FROM records r LEFT JOIN projects p ON p.id=r.project_id WHERE ${where} ORDER BY r.updated_at DESC LIMIT ? OFFSET ?`).bind(...binds, pageSize, offset).all(),
    env.DB.prepare(`SELECT COUNT(*) AS total FROM records r WHERE ${where}`).bind(...binds).first(),
  ]);
  return json({ ok: true, data: rows.results.map(mapRecord), pagination: { page, page_size: pageSize, total: count?.total || 0 }, request_id: requestId }, 200, cors);
}

async function createRecord(request, auth, env, cors, requestId) {
  const body = await readJson(request);
  const module = clean(body.module, 100);
  const title = clean(body.title || deriveTitle(body.payload || body.data || {}), 220);
  if (!module || !title) return json({ ok: false, error: 'VALIDATION_ERROR', message: '模块和标题不能为空。', request_id: requestId }, 422, cors);
  let projectId = clean(body.project_id || '', 80) || null;
  if (projectId) {
    const project = await env.DB.prepare('SELECT id FROM projects WHERE id=? AND organization_id=? AND archived_at IS NULL').bind(projectId, auth.orgId).first();
    if (!project) return json({ ok: false, error: 'INVALID_PROJECT', message: '关联项目不存在。', request_id: requestId }, 422, cors);
  }
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const payload = body.payload || body.data || {};
  await env.DB.prepare(`INSERT INTO records (id,organization_id,project_id,module,title,status,owner_name,payload_json,version,created_by,updated_by,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, auth.orgId, projectId, module, title, clean(body.status || 'draft', 40), clean(body.owner_name || body.owner || payload.owner || '', 100), JSON.stringify(payload), 1, auth.userId, auth.userId, now, now).run();
  const row = await env.DB.prepare(`SELECT r.*,p.name AS project_name,p.code AS project_code FROM records r LEFT JOIN projects p ON p.id=r.project_id WHERE r.id=?`).bind(id).first();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'record', entityId: id, action: 'create', after: mapRecord(row), requestId });
  return json({ ok: true, data: mapRecord(row), request_id: requestId }, 201, cors);
}

async function getRecord(id, auth, env, cors, requestId) {
  const row = await env.DB.prepare(`SELECT r.*,p.name AS project_name,p.code AS project_code FROM records r LEFT JOIN projects p ON p.id=r.project_id WHERE r.id=? AND r.organization_id=?`).bind(id, auth.orgId).first();
  if (!row) return notFound(cors, requestId);
  const links = await env.DB.prepare(`SELECT relation_type,from_record_id,to_record_id FROM record_links WHERE organization_id=? AND (from_record_id=? OR to_record_id=?)`).bind(auth.orgId, id, id).all();
  return json({ ok: true, data: { ...mapRecord(row), links: links.results }, request_id: requestId }, 200, cors);
}

async function updateRecord(id, request, auth, env, cors, requestId) {
  const before = await env.DB.prepare('SELECT * FROM records WHERE id=? AND organization_id=?').bind(id, auth.orgId).first();
  if (!before) return notFound(cors, requestId);
  const body = await readJson(request);
  const payload = { ...safeJson(before.payload_json, {}), ...(body.payload || body.data || {}) };
  const now = new Date().toISOString();
  await env.DB.prepare(`UPDATE records SET project_id=?,title=?,status=?,owner_name=?,payload_json=?,version=version+1,updated_by=?,updated_at=? WHERE id=? AND organization_id=?`).bind(
    body.project_id === undefined ? before.project_id : (clean(body.project_id, 80) || null), clean(body.title ?? before.title, 220), clean(body.status ?? before.status, 40), clean(body.owner_name ?? before.owner_name, 100), JSON.stringify(payload), auth.userId, now, id, auth.orgId,
  ).run();
  const after = await env.DB.prepare(`SELECT r.*,p.name AS project_name,p.code AS project_code FROM records r LEFT JOIN projects p ON p.id=r.project_id WHERE r.id=?`).bind(id).first();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'record', entityId: id, action: 'update', before: mapRecord(before), after: mapRecord(after), reason: clean(body.reason, 400), requestId });
  return json({ ok: true, data: mapRecord(after), request_id: requestId }, 200, cors);
}

async function removeRecord(id, request, auth, env, cors, requestId) {
  const before = await env.DB.prepare('SELECT * FROM records WHERE id=? AND organization_id=?').bind(id, auth.orgId).first();
  if (!before) return notFound(cors, requestId);
  const body = await readJson(request, true);
  const action = clean(body.action || 'archive', 30);
  const statusMap = { delete: 'deleted', archive: 'archived', withdraw: 'withdrawn', cancel: 'cancelled', remove: 'removed', deactivate: 'deactivated' };
  const nextStatus = statusMap[action] || 'archived';
  const now = new Date().toISOString();
  await env.DB.prepare(`UPDATE records SET status=?,archived_at=?,version=version+1,updated_by=?,updated_at=? WHERE id=? AND organization_id=?`).bind(nextStatus, now, auth.userId, now, id, auth.orgId).run();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'record', entityId: id, action, before: mapRecord(before), reason: clean(body.reason, 400), requestId });
  return json({ ok: true, data: { id, status: nextStatus }, request_id: requestId }, 200, cors);
}

async function recordAction(id, request, auth, env, cors, requestId) {
  const before = await env.DB.prepare('SELECT * FROM records WHERE id=? AND organization_id=?').bind(id, auth.orgId).first();
  if (!before) return notFound(cors, requestId);
  const body = await readJson(request);
  const action = clean(body.action, 60);
  if (!action) return json({ ok: false, error: 'VALIDATION_ERROR', message: '缺少动作类型。', request_id: requestId }, 422, cors);
  const transitions = { submitReview: 'reviewing', complete: 'completed', sign: 'signed', reconcile: 'reconciling', setDefault: 'active', assign: before.status };
  const nextStatus = transitions[action] || clean(body.status || before.status, 40);
  const payload = { ...safeJson(before.payload_json, {}), ...(body.payload || {}), last_action: action };
  const now = new Date().toISOString();
  await env.DB.prepare(`UPDATE records SET status=?,owner_name=?,payload_json=?,version=version+1,updated_by=?,updated_at=? WHERE id=? AND organization_id=?`).bind(nextStatus, clean(body.owner_name ?? before.owner_name, 100), JSON.stringify(payload), auth.userId, now, id, auth.orgId).run();
  const after = await env.DB.prepare('SELECT * FROM records WHERE id=?').bind(id).first();
  await audit(env, { orgId: auth.orgId, userId: auth.userId, entityType: 'record', entityId: id, action, before: mapRecord(before), after: mapRecord(after), reason: clean(body.reason, 400), requestId });
  return json({ ok: true, data: mapRecord(after), request_id: requestId }, 200, cors);
}

async function listAuditLogs(url, auth, env, cors, requestId) {
  const entityType = clean(url.searchParams.get('entity_type') || '', 40);
  const entityId = clean(url.searchParams.get('entity_id') || '', 80);
  const pageSize = clampInt(url.searchParams.get('page_size'), 1, 100, 50);
  const filters = ['a.organization_id=?'];
  const binds = [auth.orgId];
  if (entityType) { filters.push('a.entity_type=?'); binds.push(entityType); }
  if (entityId) { filters.push('a.entity_id=?'); binds.push(entityId); }
  const rows = await env.DB.prepare(`SELECT a.*,u.name AS actor_name FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_user_id WHERE ${filters.join(' AND ')} ORDER BY a.created_at DESC LIMIT ?`).bind(...binds, pageSize).all();
  return json({ ok: true, data: rows.results.map((r) => ({ ...r, before: safeJson(r.before_json, null), after: safeJson(r.after_json, null) })), request_id: requestId }, 200, cors);
}

async function bootstrapDemo(auth, env, cors, requestId) {
  const count = await env.DB.prepare('SELECT COUNT(*) AS total FROM projects WHERE organization_id=?').bind(auth.orgId).first();
  if ((count?.total || 0) > 0) return json({ ok: true, data: { created: false, reason: 'already_initialized' }, request_id: requestId }, 200, cors);
  await seedBusinessData(env, auth.orgId, auth.userId);
  return json({ ok: true, data: { created: true }, request_id: requestId }, 201, cors);
}

async function createDemoTenant(env) {
  const exists = await env.DB.prepare('SELECT id FROM users WHERE contact=?').bind('suzy@octopus.cloud').first();
  if (exists) return;
  const now = new Date().toISOString();
  const orgId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const { hash, salt } = await hashPassword('Octopus2026!');
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO organizations (id,name,type,region,plan,status,settings_json,created_at,updated_at) VALUES (?,?,?,'中国大陆','partner','active','{}',?,?)`).bind(orgId, '星火影业有限公司', '内容制作方', now, now),
    env.DB.prepare(`INSERT INTO users (id,name,contact,contact_type,password_hash,password_salt,status,created_at,updated_at) VALUES (?,?,?,'email',?,?,'active',?,?)`).bind(userId, 'Suzy Wang', 'suzy@octopus.cloud', hash, salt, now, now),
    env.DB.prepare(`INSERT INTO memberships (id,organization_id,user_id,role,permissions_json,status,created_at,updated_at) VALUES (?,?,?,'producer_admin','["*"]','active',?,?)`).bind(crypto.randomUUID(), orgId, userId, now, now),
  ]);
  await seedBusinessData(env, orgId, userId);
}

async function seedBusinessData(env, orgId, userId) {
  const now = new Date().toISOString();
  const projectA = crypto.randomUUID();
  const projectB = crypto.randomUUID();
  const statements = [
    env.DB.prepare(`INSERT INTO projects (id,organization_id,code,name,format,episode_count,source_language,owner_name,status,current_stage,payload_json,version,created_by,updated_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(projectA, orgId, 'OCT-2026-001', '星海漫游 S1', '漫剧 / 动画短剧', 48, '中文', 'Suzy Wang', 'active', 'production.assets', '{}', 1, userId, userId, now, now),
    env.DB.prepare(`INSERT INTO projects (id,organization_id,code,name,format,episode_count,source_language,owner_name,status,current_stage,payload_json,version,created_by,updated_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(projectB, orgId, 'OCT-2026-002', '午夜讯号 S1', '竖屏短剧', 36, '中文', 'Mia Chen', 'active', 'production.localization', '{}', 1, userId, userId, now, now),
  ];
  const samples = [
    [projectA, 'script.library', '星海漫游 S1 · 剧本 v6', 'approved', 'Suzy Wang'],
    [projectA, 'production.projects', '星海漫游 S1 · 制作项目', 'in_progress', 'Leo Meyer'],
    [projectA, 'production.tasks', 'EP01–12 画面与配音合成', 'in_progress', 'Mia Chen'],
    [projectA, 'production.assets', '星海漫游 S1 · 母片 v3-final', 'reviewing', 'Suzy Wang'],
    [projectB, 'script.library', '午夜讯号 S1 · 剧本 v4', 'approved', 'Mia Chen'],
    [projectB, 'production.assets', '午夜讯号 S1 · 母片 v2', 'approved', 'Mia Chen'],
    [projectB, 'production.localization', '午夜讯号 S1 · 英语版 en-US', 'in_progress', 'Leo Meyer'],
    [projectB, 'release.submissions', '午夜讯号 S1 · YouTube 北美提报', 'draft', 'Suzy Wang'],
  ];
  for (const [projectId, module, title, status, owner] of samples) {
    statements.push(env.DB.prepare(`INSERT INTO records (id,organization_id,project_id,module,title,status,owner_name,payload_json,version,created_by,updated_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(), orgId, projectId, module, title, status, owner, JSON.stringify({ seeded: true }), 1, userId, userId, now, now));
  }
  await env.DB.batch(statements);
}

async function issueSession(userId, orgId, request, env) {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = bytesToBase64Url(tokenBytes);
  const tokenHash = await sha256(token);
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86400000);
  await env.DB.prepare(`INSERT INTO sessions (id,user_id,organization_id,token_hash,expires_at,created_at,last_seen_at,user_agent,ip_hint) VALUES (?,?,?,?,?,?,?,?,?)`).bind(
    sessionId, userId, orgId, tokenHash, expires.toISOString(), now.toISOString(), now.toISOString(), clean(request.headers.get('User-Agent') || '', 240), clean(request.headers.get('CF-Connecting-IP') || '', 80),
  ).run();
  return { token, sessionId };
}

async function audit(env, { orgId, userId = null, entityType, entityId, action, before = null, after = null, reason = '', requestId = '' }) {
  await env.DB.prepare(`INSERT INTO audit_logs (id,organization_id,actor_user_id,entity_type,entity_id,action,before_json,after_json,reason,request_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(
    crypto.randomUUID(), orgId, userId, entityType, entityId, action, before == null ? null : JSON.stringify(before), after == null ? null : JSON.stringify(after), reason || null, requestId || null, new Date().toISOString(),
  ).run();
}

function mapProject(row) {
  return { id: row.id, organization_id: row.organization_id, code: row.code, name: row.name, format: row.format, episode_count: row.episode_count, source_language: row.source_language, owner_name: row.owner_name, status: row.status, current_stage: row.current_stage, payload: safeJson(row.payload_json, {}), version: row.version, archived_at: row.archived_at, created_at: row.created_at, updated_at: row.updated_at };
}

function mapRecord(row) {
  return { id: row.id, organization_id: row.organization_id, project_id: row.project_id, project_name: row.project_name || null, project_code: row.project_code || null, module: row.module, title: row.title, status: row.status, owner_name: row.owner_name, payload: safeJson(row.payload_json, {}), version: row.version, archived_at: row.archived_at, created_at: row.created_at, updated_at: row.updated_at };
}

async function hashPassword(password, suppliedSalt) {
  const saltBytes = suppliedSalt ? base64UrlToBytes(suppliedSalt) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: PBKDF2_ITERATIONS }, key, 256);
  return { hash: bytesToBase64Url(new Uint8Array(bits)), salt: bytesToBase64Url(saltBytes) };
}
async function verifyPassword(password, salt, expectedHash) { const result = await hashPassword(password, salt); return timingSafeEqual(result.hash, expectedHash); }
async function sha256(value) { const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)); return bytesToBase64Url(new Uint8Array(digest)); }
function timingSafeEqual(a, b) { if (a.length !== b.length) return false; let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0; }
function bytesToBase64Url(bytes) { let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); }
function base64UrlToBytes(value) { const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4); const binary = atob(padded); return Uint8Array.from(binary, (c) => c.charCodeAt(0)); }

function corsHeaders(origin, allowedConfig) {
  const allowed = allowedConfig.split(',').map((x) => x.trim()).filter(Boolean);
  const allowOrigin = allowed.includes('*') || allowed.includes(origin) ? origin || '*' : (allowed[0] || 'https://suzywang168-oss.github.io');
  return { ...JSON_HEADERS, 'Access-Control-Allow-Origin': allowOrigin, 'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Request-ID', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin', 'Cache-Control': 'no-store' };
}
function json(payload, status = 200, extraHeaders = {}) { return new Response(JSON.stringify(payload), { status, headers: { ...JSON_HEADERS, ...extraHeaders } }); }
function notFound(cors, requestId) { return json({ ok: false, error: 'NOT_FOUND', message: '记录不存在。', request_id: requestId }, 404, cors); }
async function readJson(request, allowEmpty = false) { const text = await request.text(); if (!text && allowEmpty) return {}; try { return text ? JSON.parse(text) : {}; } catch { throw new Error('INVALID_JSON'); } }
function clean(value, max = 255) { return String(value ?? '').trim().slice(0, max); }
function normalizeContact(value) { return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ''); }
function safeJson(value, fallback) { if (value == null || value === '') return fallback; if (typeof value === 'object') return value; try { return JSON.parse(value); } catch { return fallback; } }
function numberOrNull(value) { if (value === '' || value == null) return null; const n = Number(value); return Number.isFinite(n) ? n : null; }
function clampInt(value, min, max, fallback) { const n = Number.parseInt(value, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; }
function deriveTitle(payload) { const keys = ['projectName', 'scriptProject', 'productionProject', 'assetProject', 'locProject', 'submissionProject', 'scheduleProject', 'settlementProject', 'company', 'name']; for (const key of keys) if (payload?.[key]) return String(payload[key]); return `记录 ${new Date().toLocaleString('zh-CN')}`; }
