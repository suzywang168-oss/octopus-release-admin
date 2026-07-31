PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin_records (
  id TEXT NOT NULL,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  tab_key TEXT NOT NULL,
  values_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (workspace_id, id)
);

CREATE INDEX IF NOT EXISTS idx_admin_records_view
  ON admin_records(workspace_id, module_key, tab_key, sort_order, updated_at);
