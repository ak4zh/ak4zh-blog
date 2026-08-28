-- Cloudflare D1 SQLite Schema for Mind Knowledge Base & Security

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nsfw INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  name TEXT NOT NULL,
  href TEXT,
  description TEXT,
  icon TEXT,
  type TEXT DEFAULT 'link',
  status TEXT,
  author TEXT,
  creator TEXT,
  year TEXT,
  media_type TEXT,
  nsfw INTEGER DEFAULT 0,
  notes_json TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Default Settings (admin_password: 'admin', nsfw_passcode: '1234')
INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', 'admin');
INSERT OR IGNORE INTO settings (key, value) VALUES ('nsfw_passcode', '1234');
