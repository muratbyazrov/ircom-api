CREATE TABLE IF NOT EXISTS taxi_aggregator_imports (
    taxi_import_id      BIGSERIAL PRIMARY KEY,
    taxi_offer_id       BIGINT NOT NULL UNIQUE REFERENCES taxi_offers (taxi_offer_id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_taxi_aggregator_imports_message_date
    ON taxi_aggregator_imports (message_date);

CREATE INDEX IF NOT EXISTS idx_taxi_aggregator_imports_taxi_offer_id
    ON taxi_aggregator_imports (taxi_offer_id);
