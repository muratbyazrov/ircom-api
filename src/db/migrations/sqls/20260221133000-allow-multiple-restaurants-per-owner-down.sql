DROP INDEX IF EXISTS idx_restaurants_owner_account_id;

ALTER TABLE restaurants
    ADD CONSTRAINT restaurants_owner_account_id_key UNIQUE (owner_account_id);
