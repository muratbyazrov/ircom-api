SET search_path TO public;

UPDATE kitchen_categories
SET
    name = 'Кавказская кухня',
    sort_order = 10,
    is_active = TRUE,
    updated_at = NOW()
WHERE code = 'caucasian';

INSERT INTO kitchen_categories (code, name, sort_order)
VALUES
    ('ossetian', 'Осетинская кухня', 20),
    ('ossetian_pies', 'Осетинские пироги', 30)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

UPDATE kitchen_categories
SET
    sort_order = mapped.sort_order,
    is_active = TRUE,
    updated_at = NOW()
FROM (
    VALUES
        ('european', 40),
        ('asian', 50),
        ('fast_food', 60),
        ('bakery', 70),
        ('other', 999)
) AS mapped(code, sort_order)
WHERE kitchen_categories.code = mapped.code;

UPDATE menu_items
SET
    kitchen_category_id = other_category.category_id,
    category = other_category.name,
    updated_at = NOW()
FROM kitchen_categories AS uzbek_category
INNER JOIN kitchen_categories AS other_category
    ON other_category.code = 'other'
WHERE
    uzbek_category.code = 'uzbek'
    AND menu_items.kitchen_category_id = uzbek_category.category_id;

DELETE FROM kitchen_categories
WHERE code = 'uzbek';

SET search_path TO public;
