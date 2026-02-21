ALTER TABLE restaurants
    DROP CONSTRAINT IF EXISTS restaurants_owner_account_id_key;

CREATE INDEX IF NOT EXISTS idx_restaurants_owner_account_id
    ON restaurants (owner_account_id);
