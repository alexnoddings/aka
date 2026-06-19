-- recreate redirect_events without the FK to links
CREATE TABLE redirect_events_new (
    id TEXT PRIMARY KEY,
    link_id TEXT NOT NULL,
    campaign_link_id TEXT,
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
    utm_content TEXT
);

INSERT INTO redirect_events_new
    SELECT id, link_id, NULL, requested_at, referrer, user_agent, country, region, city,
           utm_source, utm_medium, utm_campaign, utm_term, utm_content
    FROM redirect_events;

DROP TABLE redirect_events;

-- recreate links with slug nullable (SQLite can't ALTER COLUMN)
CREATE TABLE links_new (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE COLLATE NOCASE,
    destination_url TEXT NOT NULL,
    notes TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO links_new SELECT * FROM links;
DROP TABLE links;
ALTER TABLE links_new RENAME TO links;

CREATE INDEX IF NOT EXISTS idx_links_slug_active ON links (slug, is_active);

-- new tables
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    notes TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaign_links (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    link_id TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY (link_id) REFERENCES links(id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_links_campaign_link
    ON campaign_links (campaign_id, link_id);

CREATE INDEX IF NOT EXISTS idx_campaign_links_slug
    ON campaign_links (slug);

-- recreate redirect_events with full FK constraints now that parent tables exist
CREATE TABLE redirect_events (
    id TEXT PRIMARY KEY,
    link_id TEXT NOT NULL,
    campaign_link_id TEXT,
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
    FOREIGN KEY (link_id) REFERENCES links(id),
    FOREIGN KEY (campaign_link_id) REFERENCES campaign_links(id)
);

INSERT INTO redirect_events
    SELECT * FROM redirect_events_new;

DROP TABLE redirect_events_new;

CREATE INDEX IF NOT EXISTS idx_redirect_events_link_requested_at
    ON redirect_events (link_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_redirect_events_requested_at
    ON redirect_events (requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_redirect_events_country
    ON redirect_events (country);

CREATE INDEX IF NOT EXISTS idx_redirect_events_campaign_link
    ON redirect_events (campaign_link_id);
