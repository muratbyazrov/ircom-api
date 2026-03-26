UPDATE listings SET price = 1 WHERE price IS NULL;

ALTER TABLE listings
    ALTER COLUMN price SET NOT NULL,
    ADD CONSTRAINT listings_price_check CHECK (price > 0);
