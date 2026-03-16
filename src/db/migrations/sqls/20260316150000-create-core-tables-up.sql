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
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT accounts_phone_no_spaces_chk
        CHECK (phone IS NULL OR phone !~ '\s')
);

CREATE TABLE IF NOT EXISTS account_sessions (
    account_session_id   BIGSERIAL PRIMARY KEY,
    account_id           BIGINT NOT NULL REFERENCES accounts (account_id),
    token                TEXT NOT NULL UNIQUE,
    expires_at           TIMESTAMPTZ NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_sessions_token
    ON account_sessions (token);

CREATE INDEX IF NOT EXISTS idx_account_sessions_account_id
    ON account_sessions (account_id);

CREATE TABLE IF NOT EXISTS listing_categories (
    category_id   BIGSERIAL PRIMARY KEY,
    code          TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 100,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_listing_categories_name_ci
    ON listing_categories (LOWER(name));

CREATE TABLE IF NOT EXISTS service_categories (
    category_id   BIGSERIAL PRIMARY KEY,
    code          TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 100,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_service_categories_name_ci
    ON service_categories (LOWER(name));

CREATE TABLE IF NOT EXISTS kitchen_categories (
    category_id   BIGSERIAL PRIMARY KEY,
    code          TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 100,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_kitchen_categories_name_ci
    ON kitchen_categories (LOWER(name));

CREATE TABLE IF NOT EXISTS listings (
    listing_id           BIGSERIAL PRIMARY KEY,
    owner_account_id     BIGINT NOT NULL REFERENCES accounts (account_id),
    kind                 SMALLINT NOT NULL CHECK (kind IN (1, 2)),
    category             TEXT NOT NULL,
    title                TEXT NOT NULL,
    description          TEXT NOT NULL,
    price                NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    real_estate_type     SMALLINT CHECK (real_estate_type IN (1, 2)),
    photos               JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    listing_category_id  BIGINT REFERENCES listing_categories (category_id),
    service_category_id  BIGINT REFERENCES service_categories (category_id),
    phone                TEXT,
    telegram             TEXT
);

CREATE INDEX IF NOT EXISTS idx_listings_kind_created_at
    ON listings (kind, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_category
    ON listings (category);

CREATE INDEX IF NOT EXISTS idx_listings_owner
    ON listings (owner_account_id);

CREATE INDEX IF NOT EXISTS idx_listings_listing_category_id
    ON listings (listing_category_id);

CREATE INDEX IF NOT EXISTS idx_listings_service_category_id
    ON listings (service_category_id);

CREATE TABLE IF NOT EXISTS listing_favorites (
    account_id      BIGINT NOT NULL REFERENCES accounts (account_id),
    listing_id      BIGINT NOT NULL REFERENCES listings (listing_id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account_id, listing_id)
);

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
    owner_account_id   BIGINT NOT NULL REFERENCES accounts (account_id),
    name               TEXT NOT NULL,
    address            TEXT,
    description        TEXT,
    logo_url           TEXT,
    phone              TEXT,
    whatsapp           TEXT,
    telegram           TEXT,
    has_delivery       BOOLEAN NOT NULL DEFAULT FALSE,
    delivery_mode      TEXT NOT NULL DEFAULT 'none',
    delivery_price     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT restaurants_delivery_mode_check
        CHECK (delivery_mode IN ('none', 'free', 'paid')),
    CONSTRAINT restaurants_delivery_price_non_negative_check
        CHECK (delivery_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_restaurants_owner_account_id
    ON restaurants (owner_account_id);

CREATE TABLE IF NOT EXISTS menu_items (
    menu_item_id         BIGSERIAL PRIMARY KEY,
    restaurant_id        BIGINT NOT NULL REFERENCES restaurants (restaurant_id),
    kitchen_category_id  BIGINT REFERENCES kitchen_categories (category_id),
    category             TEXT,
    name                 TEXT NOT NULL,
    description          TEXT,
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

CREATE INDEX IF NOT EXISTS idx_menu_items_kitchen_category_id
    ON menu_items (kitchen_category_id);

CREATE TABLE IF NOT EXISTS menu_item_favorites (
    account_id      BIGINT NOT NULL REFERENCES accounts (account_id),
    menu_item_id    BIGINT NOT NULL REFERENCES menu_items (menu_item_id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account_id, menu_item_id)
);

SET search_path TO public;
