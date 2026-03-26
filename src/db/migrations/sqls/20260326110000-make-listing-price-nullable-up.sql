ALTER TABLE listings
    ALTER COLUMN price DROP NOT NULL,
    DROP CONSTRAINT IF EXISTS listings_price_check;
