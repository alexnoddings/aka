PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS links (
	id TEXT PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
	destination_url TEXT NOT NULL,
	notes TEXT,
	is_active INTEGER NOT NULL DEFAULT 1,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_slug_active
	ON links (slug);

CREATE INDEX IF NOT EXISTS idx_links_slug_active
	ON links (slug, is_active);

CREATE TABLE IF NOT EXISTS redirect_events (
	id TEXT PRIMARY KEY,
	link_id TEXT NOT NULL,
	requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	referrer TEXT,
	user_agent TEXT,
	country TEXT,
	region TEXT,
	city TEXT,
	utm_source TEXT,
	utm_medium TEXT,
	utm_campaign TEXT,
	utm_term TEXT,
	utm_content TEXT,
	FOREIGN KEY (link_id) REFERENCES links(id)
);

CREATE INDEX IF NOT EXISTS idx_redirect_events_link_requested_at
	ON redirect_events (link_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_redirect_events_requested_at
	ON redirect_events (requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_redirect_events_country
	ON redirect_events (country);
