SET search_path TO public;

INSERT INTO listing_categories (code, name, sort_order)
VALUES
    ('real_estate', 'Недвижимость', 10),
    ('transport', 'Авто', 20),
    ('electronics', 'Электроника', 30),
    ('for_home', 'Для дома', 40),
    ('children', 'Для детей', 50),
    ('jobs', 'Работа', 60),
    ('other', 'Другое', 999)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO service_categories (code, name, sort_order)
VALUES
    ('beauty', 'Красота', 10),
    ('repair', 'Ремонт', 20),
    ('construction', 'Строительство', 30),
    ('education', 'Обучение', 40),
    ('it', 'IT-услуги', 50),
    ('auto_service', 'Автосервис', 60),
    ('cleaning', 'Уборка', 70),
    ('other', 'Другое', 999)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO kitchen_categories (code, name, sort_order)
VALUES
    ('caucasian', 'Кавказская кухня', 10),
    ('uzbek', 'Узбекская кухня', 20),
    ('european', 'Европейская кухня', 30),
    ('asian', 'Азиатская кухня', 40),
    ('fast_food', 'Фастфуд', 50),
    ('bakery', 'Выпечка', 60),
    ('other', 'Другое', 999)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

SET search_path TO public;
