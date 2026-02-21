SET search_path TO public;

CREATE TABLE IF NOT EXISTS accounts (
    account_id       BIGSERIAL PRIMARY KEY,
    name             TEXT NOT NULL,
    phone            TEXT UNIQUE,
    password_hash    TEXT NOT NULL,
    password_salt    TEXT NOT NULL,
    whatsapp         TEXT,
    telegram         TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS account_sessions (
    account_session_id   BIGSERIAL PRIMARY KEY,
    account_id           BIGINT NOT NULL REFERENCES accounts (account_id),
    token                TEXT NOT NULL UNIQUE,
    expires_at           TIMESTAMPTZ NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_sessions_token ON account_sessions (token);
CREATE INDEX IF NOT EXISTS idx_account_sessions_account_id ON account_sessions (account_id);

CREATE TABLE IF NOT EXISTS listings (
    listing_id         BIGSERIAL PRIMARY KEY,
    owner_account_id   BIGINT NOT NULL REFERENCES accounts (account_id),
    kind               SMALLINT NOT NULL CHECK (kind IN (1, 2)),
    category           TEXT NOT NULL,
    title              TEXT NOT NULL,
    description        TEXT NOT NULL,
    price              NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    real_estate_type   SMALLINT CHECK (real_estate_type IN (1, 2)),
    photos             JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_kind_created_at
    ON listings (kind, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_category
    ON listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_owner
    ON listings (owner_account_id);

CREATE TABLE IF NOT EXISTS listing_favorites (
    account_id      BIGINT NOT NULL REFERENCES accounts (account_id),
    listing_id      BIGINT NOT NULL REFERENCES listings (listing_id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account_id, listing_id)
);

CREATE TABLE IF NOT EXISTS taxi_offers (
    taxi_offer_id      BIGSERIAL PRIMARY KEY,
    owner_account_id   BIGINT NOT NULL REFERENCES accounts (account_id),
    direction          SMALLINT NOT NULL CHECK (direction IN (1, 2, 3)),
    display_name       TEXT NOT NULL,
    description        TEXT,
    price              NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    phone              TEXT NOT NULL,
    whatsapp           TEXT,
    telegram           TEXT,
    departure_at       TIMESTAMPTZ,
    seats_total        INTEGER CHECK (seats_total > 0),
    seats_free         INTEGER CHECK (seats_free >= 0),
    car_photos         JSONB NOT NULL DEFAULT '[]'::jsonb,
    rating             NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    reviews_count      INTEGER NOT NULL DEFAULT 0,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_taxi_offers_direction_created_at
    ON taxi_offers (direction, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_taxi_offers_owner
    ON taxi_offers (owner_account_id);

CREATE TABLE IF NOT EXISTS taxi_favorites (
    account_id      BIGINT NOT NULL REFERENCES accounts (account_id),
    taxi_offer_id   BIGINT NOT NULL REFERENCES taxi_offers (taxi_offer_id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account_id, taxi_offer_id)
);

CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id      BIGSERIAL PRIMARY KEY,
    owner_account_id   BIGINT NOT NULL UNIQUE REFERENCES accounts (account_id),
    name               TEXT NOT NULL,
    description        TEXT,
    logo_url           TEXT,
    phone              TEXT,
    whatsapp           TEXT,
    telegram           TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    menu_item_id         BIGSERIAL PRIMARY KEY,
    restaurant_id        BIGINT NOT NULL REFERENCES restaurants (restaurant_id),
    category             TEXT,
    name                 TEXT NOT NULL,
    description          TEXT,
    cook_time_minutes    INTEGER CHECK (cook_time_minutes > 0),
    always_in_stock      BOOLEAN NOT NULL DEFAULT FALSE,
    price                NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    has_delivery         BOOLEAN NOT NULL DEFAULT FALSE,
    is_available         BOOLEAN NOT NULL DEFAULT TRUE,
    photos               JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_created_at
    ON menu_items (restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_category
    ON menu_items (category);

CREATE TABLE IF NOT EXISTS menu_item_favorites (
    account_id      BIGINT NOT NULL REFERENCES accounts (account_id),
    menu_item_id    BIGINT NOT NULL REFERENCES menu_items (menu_item_id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account_id, menu_item_id)
);

SET search_path TO public;
