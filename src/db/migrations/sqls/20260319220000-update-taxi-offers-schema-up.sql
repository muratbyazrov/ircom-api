ALTER TABLE taxi_offers
    ADD COLUMN IF NOT EXISTS route_direction SMALLINT CHECK (route_direction IN (1, 2)),
    ADD COLUMN IF NOT EXISTS from_place TEXT,
    ADD COLUMN IF NOT EXISTS to_place TEXT,
    ADD COLUMN IF NOT EXISTS route_text TEXT;

CREATE INDEX IF NOT EXISTS idx_taxi_offers_direction_route_departure
    ON taxi_offers (direction, route_direction, departure_at ASC);

ALTER TABLE taxi_offers
    ALTER COLUMN rating SET DEFAULT 0;

UPDATE taxi_offers
SET rating = 0
WHERE reviews_count = 0
  AND rating = 5.0;

ALTER TABLE taxi_offers
    DROP COLUMN IF EXISTS display_name;

ALTER TABLE taxi_offers
    ADD COLUMN IF NOT EXISTS vehicle TEXT;
