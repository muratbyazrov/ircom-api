SET search_path TO public;

CREATE TABLE IF NOT EXISTS listing_aggregator_imports (
    listing_import_id   BIGSERIAL PRIMARY KEY,
    listing_id          BIGINT NOT NULL UNIQUE REFERENCES listings (listing_id) ON DELETE CASCADE,
    source              TEXT NOT NULL,
    msg_id              BIGINT NOT NULL,
    message_date        TIMESTAMPTZ NOT NULL,
    permalink           TEXT,
    content_hash        TEXT,
    photo_object_keys   JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source, msg_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_aggregator_imports_message_date
    ON listing_aggregator_imports (message_date);

CREATE INDEX IF NOT EXISTS idx_listing_aggregator_imports_listing_id
    ON listing_aggregator_imports (listing_id);

SET search_path TO public;
