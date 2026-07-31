PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  level TEXT DEFAULT 'B',
  region TEXT,
  projects INTEGER DEFAULT 0,
  income TEXT DEFAULT '¥0',
  contract_status TEXT DEFAULT '审核中',
  contact_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(workspace_id, name)
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  partner_id TEXT REFERENCES partners(id) ON DELETE SET NULL,
  contract_no TEXT NOT NULL,
  type TEXT,
  signed_at TEXT,
  expires_at TEXT,
  sharing_rule TEXT,
  amount TEXT,
  status TEXT DEFAULT '草稿',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(workspace_id, contract_no)
);

CREATE TABLE IF NOT EXISTS risk_cases (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meta TEXT,
  description TEXT,
  copyright_score INTEGER DEFAULT 0,
  violence_score INTEGER DEFAULT 0,
  sensitive_score INTEGER DEFAULT 0,
  overall TEXT DEFAULT '待审核',
  status TEXT DEFAULT '待审核',
  reviewer_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settlements (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  bill_no TEXT NOT NULL,
  partner_id TEXT REFERENCES partners(id) ON DELETE SET NULL,
  partner_name TEXT,
  period TEXT,
  amount TEXT,
  platform_share TEXT,
  status TEXT DEFAULT '待确认',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(workspace_id, bill_no)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  module TEXT,
  action TEXT NOT NULL,
  object_type TEXT,
  object_id TEXT,
  detail TEXT DEFAULT '{}',
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_partners_workspace ON partners(workspace_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_risk_workspace ON risk_cases(workspace_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_settlements_workspace ON settlements(workspace_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_audit_workspace ON audit_logs(workspace_id, created_at);
