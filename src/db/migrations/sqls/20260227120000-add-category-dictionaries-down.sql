SET search_path TO public;

DROP INDEX IF EXISTS idx_menu_items_kitchen_category_id;

ALTER TABLE menu_items
    DROP COLUMN IF EXISTS kitchen_category_id;

DROP INDEX IF EXISTS idx_listings_service_category_id;
DROP INDEX IF EXISTS idx_listings_listing_category_id;

ALTER TABLE listings
    DROP COLUMN IF EXISTS service_category_id,
    DROP COLUMN IF EXISTS listing_category_id;

DROP INDEX IF EXISTS ux_kitchen_categories_name_ci;
DROP TABLE IF EXISTS kitchen_categories;

DROP INDEX IF EXISTS ux_service_categories_name_ci;
DROP TABLE IF EXISTS service_categories;

DROP INDEX IF EXISTS ux_listing_categories_name_ci;
DROP TABLE IF EXISTS listing_categories;

SET search_path TO public;
