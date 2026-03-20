ALTER TABLE taxi_offers
    DROP COLUMN IF EXISTS vehicle;

ALTER TABLE taxi_offers
    ADD COLUMN IF NOT EXISTS display_name TEXT;

UPDATE taxi_offers
SET display_name = COALESCE(display_name, route_text, 'Такси')
WHERE display_name IS NULL;

ALTER TABLE taxi_offers
    ALTER COLUMN display_name SET NOT NULL;

ALTER TABLE taxi_offers
    ALTER COLUMN rating SET DEFAULT 5.0;

UPDATE taxi_offers
SET rating = 5.0
WHERE reviews_count = 0
  AND rating = 0;

DROP INDEX IF EXISTS idx_taxi_offers_direction_route_departure;

ALTER TABLE taxi_offers
    DROP COLUMN IF EXISTS route_text,
    DROP COLUMN IF EXISTS to_place,
    DROP COLUMN IF EXISTS from_place,
    DROP COLUMN IF EXISTS route_direction;
