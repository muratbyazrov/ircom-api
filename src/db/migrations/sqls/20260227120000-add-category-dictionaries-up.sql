SET search_path TO public;

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

INSERT INTO listing_categories (code, name, sort_order)
VALUES
    ('real_estate', 'Недвижимость', 10),
    ('transport', 'Транспорт', 20),
    ('electronics', 'Электроника', 30),
    ('for_home', 'Для дома', 40),
    ('children', 'Для детей', 50),
    ('jobs', 'Работа', 60),
    ('other', 'Другое', 999)
ON CONFLICT (code) DO NOTHING;

INSERT INTO service_categories (code, name, sort_order)
VALUES
    ('beauty', 'Красота', 10),
    ('repair', 'Ремонт', 20),
    ('construction', 'Строительство', 30),
    ('education', 'Обучение', 40),
    ('it', 'IT-услуги', 50),
    ('auto_service', 'Автосервис', 60),
    ('cleaning', 'Уборка', 70),
    ('other', 'Другое', 999)
ON CONFLICT (code) DO NOTHING;

INSERT INTO kitchen_categories (code, name, sort_order)
VALUES
    ('caucasian', 'Кавказская кухня', 10),
    ('uzbek', 'Узбекская кухня', 20),
    ('european', 'Европейская кухня', 30),
    ('asian', 'Азиатская кухня', 40),
    ('fast_food', 'Фастфуд', 50),
    ('bakery', 'Выпечка', 60),
    ('other', 'Другое', 999)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE listings
    ADD COLUMN IF NOT EXISTS listing_category_id BIGINT REFERENCES listing_categories (category_id),
    ADD COLUMN IF NOT EXISTS service_category_id BIGINT REFERENCES service_categories (category_id);

CREATE INDEX IF NOT EXISTS idx_listings_listing_category_id
    ON listings (listing_category_id);

CREATE INDEX IF NOT EXISTS idx_listings_service_category_id
    ON listings (service_category_id);

UPDATE listings AS l
SET listing_category_id = lc.category_id
FROM listing_categories AS lc
WHERE
    l.kind = 1
    AND l.category IS NOT NULL
    AND LOWER(BTRIM(l.category)) = LOWER(lc.name)
    AND l.listing_category_id IS NULL;

INSERT INTO listing_categories (code, name, sort_order)
SELECT
    CONCAT('legacy_listing_', MD5(LOWER(BTRIM(l.category)))),
    BTRIM(l.category),
    900
FROM listings AS l
WHERE
    l.kind = 1
    AND l.category IS NOT NULL
    AND BTRIM(l.category) <> ''
    AND l.listing_category_id IS NULL
ON CONFLICT (code) DO NOTHING;

UPDATE listings AS l
SET listing_category_id = lc.category_id
FROM listing_categories AS lc
WHERE
    l.kind = 1
    AND l.category IS NOT NULL
    AND LOWER(BTRIM(l.category)) = LOWER(lc.name)
    AND l.listing_category_id IS NULL;

UPDATE listings AS l
SET service_category_id = sc.category_id
FROM service_categories AS sc
WHERE
    l.kind = 2
    AND l.category IS NOT NULL
    AND LOWER(BTRIM(l.category)) = LOWER(sc.name)
    AND l.service_category_id IS NULL;

INSERT INTO service_categories (code, name, sort_order)
SELECT
    CONCAT('legacy_service_', MD5(LOWER(BTRIM(l.category)))),
    BTRIM(l.category),
    900
FROM listings AS l
WHERE
    l.kind = 2
    AND l.category IS NOT NULL
    AND BTRIM(l.category) <> ''
    AND l.service_category_id IS NULL
ON CONFLICT (code) DO NOTHING;

UPDATE listings AS l
SET service_category_id = sc.category_id
FROM service_categories AS sc
WHERE
    l.kind = 2
    AND l.category IS NOT NULL
    AND LOWER(BTRIM(l.category)) = LOWER(sc.name)
    AND l.service_category_id IS NULL;

ALTER TABLE menu_items
    ADD COLUMN IF NOT EXISTS kitchen_category_id BIGINT REFERENCES kitchen_categories (category_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_kitchen_category_id
    ON menu_items (kitchen_category_id);

UPDATE menu_items AS m
SET kitchen_category_id = kc.category_id
FROM kitchen_categories AS kc
WHERE
    m.category IS NOT NULL
    AND LOWER(BTRIM(m.category)) = LOWER(kc.name)
    AND m.kitchen_category_id IS NULL;

INSERT INTO kitchen_categories (code, name, sort_order)
SELECT
    CONCAT('legacy_kitchen_', MD5(LOWER(BTRIM(m.category)))),
    BTRIM(m.category),
    900
FROM menu_items AS m
WHERE
    m.category IS NOT NULL
    AND BTRIM(m.category) <> ''
    AND m.kitchen_category_id IS NULL
ON CONFLICT (code) DO NOTHING;

UPDATE menu_items AS m
SET kitchen_category_id = kc.category_id
FROM kitchen_categories AS kc
WHERE
    m.category IS NOT NULL
    AND LOWER(BTRIM(m.category)) = LOWER(kc.name)
    AND m.kitchen_category_id IS NULL;

SET search_path TO public;
