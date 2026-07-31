PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS contents (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  owner TEXT,
  region TEXT,
  languages TEXT,
  status TEXT NOT NULL DEFAULT '待上线',
  views TEXT DEFAULT '0',
  description TEXT,
  tags TEXT DEFAULT '[]',
  cover_url TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(workspace_id, code)
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  content_id TEXT REFERENCES contents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT,
  duration TEXT,
  size_bytes INTEGER DEFAULT 0,
  language TEXT,
  spec TEXT,
  status TEXT DEFAULT '待审核',
  storage_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS release_tasks (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  content_id TEXT REFERENCES contents(id) ON DELETE SET NULL,
  content_name TEXT,
  channel TEXT,
  owner TEXT,
  progress INTEGER NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT '制作中',
  deadline TEXT,
  priority TEXT DEFAULT 'normal',
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(workspace_id, code)
);

CREATE TABLE IF NOT EXISTS workflow_steps (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL REFERENCES release_tasks(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '等待中',
  progress INTEGER NOT NULL DEFAULT 0,
  payload TEXT DEFAULT '{}',
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(task_id, step_order)
);

CREATE TABLE IF NOT EXISTS ai_jobs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT,
  content_name TEXT,
  priority TEXT DEFAULT 'normal',
  duration TEXT,
  cost TEXT,
  status TEXT DEFAULT '排队中',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS channels (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  abbr TEXT,
  region TEXT,
  status TEXT DEFAULT '待配置',
  income TEXT DEFAULT '¥0',
  views TEXT DEFAULT '0',
  roi TEXT DEFAULT '0',
  sync_rate TEXT DEFAULT '—',
  api_config TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(workspace_id, name)
);

CREATE INDEX IF NOT EXISTS idx_contents_workspace ON contents(workspace_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON release_tasks(workspace_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_channels_workspace ON channels(workspace_id, updated_at);
