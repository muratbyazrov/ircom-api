ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS delivery_mode TEXT NOT NULL DEFAULT 'none';

ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS delivery_price NUMERIC(12, 2) NOT NULL DEFAULT 0;

UPDATE restaurants
SET
    delivery_mode = CASE
        WHEN has_delivery THEN 'free'
        ELSE 'none'
    END,
    delivery_price = 0
WHERE
    has_delivery = TRUE
    OR COALESCE(delivery_mode, '') NOT IN ('none', 'free', 'paid');

UPDATE restaurants
SET delivery_price = 0
WHERE delivery_mode <> 'paid';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'restaurants_delivery_mode_check'
    ) THEN
        ALTER TABLE restaurants
        ADD CONSTRAINT restaurants_delivery_mode_check
        CHECK (delivery_mode IN ('none', 'free', 'paid'));
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'restaurants_delivery_price_non_negative_check'
    ) THEN
        ALTER TABLE restaurants
        ADD CONSTRAINT restaurants_delivery_price_non_negative_check
        CHECK (delivery_price >= 0);
    END IF;
END
$$;
