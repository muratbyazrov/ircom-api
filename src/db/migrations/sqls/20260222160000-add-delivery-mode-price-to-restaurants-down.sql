ALTER TABLE restaurants
DROP CONSTRAINT IF EXISTS restaurants_delivery_price_non_negative_check;

ALTER TABLE restaurants
DROP CONSTRAINT IF EXISTS restaurants_delivery_mode_check;

ALTER TABLE restaurants
DROP COLUMN IF EXISTS delivery_price;

ALTER TABLE restaurants
DROP COLUMN IF EXISTS delivery_mode;
