SET search_path TO public;

DELETE FROM kitchen_categories
WHERE code IN ('caucasian', 'uzbek', 'european', 'asian', 'fast_food', 'bakery', 'other');

DELETE FROM service_categories
WHERE code IN ('beauty', 'repair', 'construction', 'education', 'it', 'auto_service', 'cleaning', 'other');

DELETE FROM listing_categories
WHERE code IN ('real_estate', 'transport', 'electronics', 'for_home', 'children', 'jobs', 'other');

SET search_path TO public;
