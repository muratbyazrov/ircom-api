SET search_path TO public;

DELETE FROM kitchen_categories
WHERE code IN ('ossetian', 'ossetian_pies');

INSERT INTO kitchen_categories (code, name, sort_order)
VALUES ('uzbek', 'Узбекская кухня', 20)
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
        ('caucasian', 10),
        ('uzbek', 20),
        ('european', 30),
        ('asian', 40),
        ('fast_food', 50),
        ('bakery', 60),
        ('other', 999)
) AS mapped(code, sort_order)
WHERE kitchen_categories.code = mapped.code;

SET search_path TO public;
