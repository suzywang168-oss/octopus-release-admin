PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '内容制作方',
  region TEXT,
  plan TEXT NOT NULL DEFAULT 'partner',
  status TEXT NOT NULL DEFAULT 'active',
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL UNIQUE,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email','phone')),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'producer_admin',
  permissions_json TEXT NOT NULL DEFAULT '["*"]',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (organization_id, user_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  user_agent TEXT,
  ip_hint TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  format TEXT,
  episode_count INTEGER,
  source_language TEXT,
  owner_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  current_stage TEXT NOT NULL DEFAULT 'overview',
  payload_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (organization_id, code),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  project_id TEXT,
  module TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  owner_name TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS record_links (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  from_record_id TEXT NOT NULL,
  to_record_id TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (from_record_id, to_record_id, relation_type),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (from_record_id) REFERENCES records(id) ON DELETE CASCADE,
  FOREIGN KEY (to_record_id) REFERENCES records(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  actor_user_id TEXT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  reason TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash, expires_at);
CREATE INDEX IF NOT EXISTS idx_projects_org_status ON projects(organization_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_org_module ON records(organization_id, module, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_project ON records(project_id, module, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_status ON records(organization_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(organization_id, entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(organization_id, created_at DESC);
