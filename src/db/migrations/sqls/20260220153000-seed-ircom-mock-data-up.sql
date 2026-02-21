SET search_path TO "ircom-api";

INSERT INTO accounts (
     name
    ,phone
    ,password_hash
    ,password_salt
    ,whatsapp
    ,telegram
)
VALUES
    ('Продавец AD1', '+7(929)123-45-67', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Продавец AD2', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)111-11-11', '@rentos'),
    ('Продавец AD3', '+7(929)777-10-10', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Продавец AD4', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)444-11-99', NULL),
    ('Продавец AD5', '+7(929)100-88-11', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Продавец AD6', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@tyres_os'),
    ('Продавец AD7', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)101-33-22', NULL),
    ('Продавец AD8', '+7(929)453-87-90', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Исполнитель S1', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)999-10-10', NULL),
    ('Исполнитель S2', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@mathcoach'),
    ('Исполнитель S3', '+7(929)345-12-77', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Исполнитель S4', '+7(929)288-00-77', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Исполнитель S5', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)670-90-10', NULL),
    ('Исполнитель S6', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@eng_with_ira'),
    ('Исполнитель S7', '+7(929)555-77-10', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Володя', '+7(929)906-78-93', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)906-78-93', NULL),
    ('Руслан', '+7(929)915-11-22', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Инал', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@inal_drive'),
    ('Алан', '+7(929)800-11-22', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@alanride'),
    ('Георгий', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)401-40-40', NULL),
    ('Сослан', '+7(929)333-22-11', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Тамерлан', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@tam_taxi'),
    ('Коста', '+7(929)500-01-00', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Кафе Тест', '+7(929)111-22-33', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)111-22-33', '@cafe_test'),
    ('Пекарня Дарьял', '+7(929)444-10-10', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)611-11-12', NULL),
    ('Sakura Roll', '+7(929)333-90-90', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Кавказ Двор', NULL, 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@kavkaz_food'),
    ('Burger Point', '+7(929)789-40-20', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL),
    ('Ocean Sushi Lab', '+7(929)411-22-11', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)411-22-11', '@ocean_sushi_lab'),
    ('Smash House', '+7(929)732-20-20', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)732-20-20', NULL),
    ('Мангал №1', '+7(929)622-44-88', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, '@mangal_no1'),
    ('Пироговый Дом', '+7(929)744-66-90', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', '+7(929)744-66-90', NULL),
    ('Green Bowl', '+7(929)365-50-50', 'b3506d16f98bc88b345bd56102796ee0126e06d449c69db9ac18547a5cad89e8184d56b51a78d044253534ce2f8ae32733238927addf93c0d6bb83a9739df90b', 'ircom-seed-salt-v1', NULL, NULL)
ON CONFLICT (phone) DO UPDATE SET
     name = EXCLUDED.name
    ,password_hash = EXCLUDED.password_hash
    ,password_salt = EXCLUDED.password_salt
    ,whatsapp = EXCLUDED.whatsapp
    ,telegram = EXCLUDED.telegram
    ,updated_at = NOW();

INSERT INTO listings (
     owner_account_id
    ,kind
    ,category
    ,title
    ,description
    ,price
    ,real_estate_type
    ,photos
    ,created_at
    ,updated_at
)
VALUES
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD1' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Электроника', 'iPhone 12, 128GB', 'Состояние отличное, аккумулятор 86%, комплект полный.', 32000, NULL, '["https://picsum.photos/seed/iphone%2Csmartphone-101/900/600","https://picsum.photos/seed/phone%2Capple-102/900/600","https://picsum.photos/seed/mobile%2Cdevice-109/900/600"]'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD2' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Недвижимость', '1-комн. квартира', 'Центр, после ремонта, рядом транспорт.', 18000, NULL, '[]'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD3' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Авто', 'Lada Vesta 2019', 'Без ДТП, один владелец, торг у капота.', 790000, NULL, '["https://picsum.photos/seed/car%2Csedan-105/900/600","https://picsum.photos/seed/car%2Cinterior-112/900/600","https://picsum.photos/seed/car%2Croad-113/900/600"]'::jsonb, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD4' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Бытовая техника', 'Стиральная машина LG', 'Работает тихо, без протечек, 6 кг загрузка.', 17500, NULL, '["https://picsum.photos/seed/washing-machine%2Chome-appliance-114/900/600","https://picsum.photos/seed/laundry%2Cappliance-115/900/600"]'::jsonb, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD5' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Мебель', 'Диван угловой', 'Почти новый, ткань антивандальная, есть ниша для белья.', 25000, NULL, '["https://picsum.photos/seed/sofa%2Cfurniture-106/900/600","https://picsum.photos/seed/living-room%2Csofa-116/900/600","https://picsum.photos/seed/furniture%2Cinterior-117/900/600"]'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD6' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Авто', 'Комплект зимней резины R16', 'Nokian, остаток 70%, без грыж и порезов.', 14000, NULL, '[]'::jsonb, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD7' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Электроника', 'PlayStation 5', 'В комплекте 2 геймпада и зарядная станция.', 47000, NULL, '["https://picsum.photos/seed/gaming%2Cconsole-108/900/600","https://picsum.photos/seed/controller%2Cgaming-119/900/600","https://picsum.photos/seed/playstation%2Csetup-120/900/600"]'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Продавец AD8' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Другое', 'Горный велосипед', 'Алюминиевая рама, дисковые тормоза.', 22000, NULL, '["https://picsum.photos/seed/mountain-bike%2Cbicycle-121/900/600","https://picsum.photos/seed/bike%2Ccycling-122/900/600","https://picsum.photos/seed/bicycle%2Ctrail-123/900/600"]'::jsonb, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S1' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Кондитерка', 'Торты на заказ', 'Свадебные и детские торты, доставка.', 1800, NULL, '["https://picsum.photos/seed/cake%2Cbakery-201/900/600","https://picsum.photos/seed/dessert%2Ccake-206/900/600","https://picsum.photos/seed/wedding-cake%2Cbakery-207/900/600"]'::jsonb, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S2' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Репетиторы', 'Математика 5-11 класс', 'Подготовка к ОГЭ/ЕГЭ, онлайн и офлайн.', 700, NULL, '[]'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S3' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Красота', 'Маникюр и покрытие', 'Стерильный инструмент, дизайн любой сложности.', 1200, NULL, '["https://picsum.photos/seed/manicure%2Cnails-203/900/600","https://picsum.photos/seed/nail-salon%2Cbeauty-209/900/600","https://picsum.photos/seed/beauty%2Cmanicure-210/900/600"]'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S4' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Автосервис', 'Диагностика двигателя', 'Компьютерная диагностика и рекомендации.', 1500, NULL, '["https://picsum.photos/seed/car-service%2Cmechanic-211/900/600","https://picsum.photos/seed/engine%2Cdiagnostic-212/900/600"]'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S5' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Кондитерка', 'Осетинские пироги на заказ', 'Горячие, доставка в течение часа.', 450, NULL, '["https://picsum.photos/seed/pie%2Cbakery-204/900/600","https://picsum.photos/seed/pastry%2Cbread-213/900/600"]'::jsonb, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S6' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Репетиторы', 'Английский язык', 'Разговорная практика, школьная программа.', 900, NULL, '[]'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Исполнитель S7' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Другое', 'Ремонт ноутбуков', 'Чистка, замена термопасты, апгрейд SSD.', 2500, NULL, '["https://picsum.photos/seed/laptop%2Crepair-215/900/600","https://picsum.photos/seed/computer%2Cservice-216/900/600"]'::jsonb, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO taxi_offers (
     owner_account_id
    ,direction
    ,display_name
    ,description
    ,price
    ,phone
    ,whatsapp
    ,telegram
    ,departure_at
    ,seats_total
    ,seats_free
    ,car_photos
    ,rating
    ,created_at
    ,updated_at
)
VALUES
    ((SELECT account_id FROM accounts WHERE name = 'Володя' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Володя', 'Быстрая подача, аккуратное вождение.', 200, '+7(929)906-78-93', '+7(929)906-78-93', NULL, NULL, NULL, NULL, '["https://picsum.photos/seed/taxi%2Ccar-301/900/600","https://picsum.photos/seed/taxi%2Ccity-307/900/600","https://picsum.photos/seed/driver%2Cvehicle-308/900/600"]'::jsonb, 4, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Руслан' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Руслан', 'Детское кресло по запросу.', 230, '+7(929)915-11-22', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb, 4.6, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Инал' AND password_salt = 'ircom-seed-salt-v1'), 1, 'Инал', 'Работаю до позднего вечера.', 180, '+7(900)000-03-03', NULL, '@inal_drive', NULL, NULL, NULL, '["https://picsum.photos/seed/driver%2Ccar-302/900/600","https://picsum.photos/seed/street%2Ccar-311/900/600"]'::jsonb, 4.2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Алан' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Алан', 'Еду через КПП, помогу с багажом.', 1200, '+7(929)800-11-22', NULL, '@alanride', date_trunc('day', NOW()) + INTERVAL '15 hour' + INTERVAL '30 minute', 4, 2, '["https://picsum.photos/seed/road%2Ccar-303/900/600","https://picsum.photos/seed/highway%2Ctrip-312/900/600","https://picsum.photos/seed/car%2Cmountains-313/900/600"]'::jsonb, 4.4, NOW() - INTERVAL '0 days', NOW() - INTERVAL '0 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Георгий' AND password_salt = 'ircom-seed-salt-v1'), 2, 'Георгий', 'Пунктуально, без задержек.', 1100, '+7(929)401-40-40', '+7(929)401-40-40', NULL, date_trunc('day', NOW()) + INTERVAL '1 day' + INTERVAL '8 hour' + INTERVAL '0 minute', 4, 1, '["https://picsum.photos/seed/highway%2Ccar-304/900/600","https://picsum.photos/seed/road%2Cmountain-314/900/600"]'::jsonb, 4.7, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Сослан' AND password_salt = 'ircom-seed-salt-v1'), 3, 'Сослан', 'Выезд по расписанию, кондиционер.', 1300, '+7(929)333-22-11', NULL, NULL, date_trunc('day', NOW()) + INTERVAL '1 day' + INTERVAL '9 hour' + INTERVAL '0 minute', 4, 1, '[]'::jsonb, 4.2, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Тамерлан' AND password_salt = 'ircom-seed-salt-v1'), 3, 'Тамерлан', 'Можно с небольшими животными.', 1250, '+7(900)000-07-07', NULL, '@tam_taxi', date_trunc('day', NOW()) + INTERVAL '19 hour' + INTERVAL '20 minute', 4, 3, '["https://picsum.photos/seed/evening%2Ccar-316/900/600","https://picsum.photos/seed/road%2Cnight-317/900/600"]'::jsonb, 4.5, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT account_id FROM accounts WHERE name = 'Коста' AND password_salt = 'ircom-seed-salt-v1'), 3, 'Коста', 'Минивэн, много места для багажа.', 1400, '+7(929)500-01-00', NULL, NULL, date_trunc('day', NOW()) + ((8 - EXTRACT(ISODOW FROM NOW())::int) % 7) * INTERVAL '1 day' + INTERVAL '7 hour' + INTERVAL '30 minute', 6, 4, '["https://picsum.photos/seed/minivan%2Ctravel-306/900/600","https://picsum.photos/seed/van%2Croad-318/900/600","https://picsum.photos/seed/vehicle%2Ctrip-319/900/600"]'::jsonb, 4.1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO restaurants (
     owner_account_id
    ,name
    ,description
    ,logo_url
    ,phone
    ,whatsapp
    ,telegram
)
VALUES
    ((SELECT account_id FROM accounts WHERE name = 'Кафе Тест' AND password_salt = 'ircom-seed-salt-v1'), 'Кафе Тест', 'г. Цхинвал, ул. Тестовая, 10', 'https://picsum.photos/seed/cafe%2Ctest%2Clogo-800/900/600', '+7(929)111-22-33', '+7(929)111-22-33', '@cafe_test'),
    ((SELECT account_id FROM accounts WHERE name = 'Пекарня Дарьял' AND password_salt = 'ircom-seed-salt-v1'), 'Пекарня Дарьял', 'г. Цхинвал, ул. Мира, 14', 'https://picsum.photos/seed/bakery%2Clogo%2Csign-801/900/600', '+7(929)444-10-10', '+7(929)611-11-12', NULL),
    ((SELECT account_id FROM accounts WHERE name = 'Sakura Roll' AND password_salt = 'ircom-seed-salt-v1'), 'Sakura Roll', 'г. Цхинвал, ул. Исака Харебова, 7', 'https://picsum.photos/seed/sushi%2Crestaurant%2Clogo-802/900/600', '+7(929)333-90-90', NULL, NULL),
    ((SELECT account_id FROM accounts WHERE name = 'Кавказ Двор' AND password_salt = 'ircom-seed-salt-v1'), 'Кавказ Двор', 'г. Цхинвал, пр-т Алана Джиоева, 22', 'https://picsum.photos/seed/caucasus%2Crestaurant%2Clogo-803/900/600', NULL, NULL, '@kavkaz_food'),
    ((SELECT account_id FROM accounts WHERE name = 'Burger Point' AND password_salt = 'ircom-seed-salt-v1'), 'Burger Point', 'г. Цхинвал, ул. Сталина, 39', 'https://picsum.photos/seed/burger%2Crestaurant%2Clogo-804/900/600', '+7(929)789-40-20', NULL, NULL),
    ((SELECT account_id FROM accounts WHERE name = 'Ocean Sushi Lab' AND password_salt = 'ircom-seed-salt-v1'), 'Ocean Sushi Lab', 'г. Цхинвал, ул. Героев, 11', 'https://picsum.photos/seed/ocean%2Csushi%2Clogo-805/900/600', '+7(929)411-22-11', '+7(929)411-22-11', '@ocean_sushi_lab'),
    ((SELECT account_id FROM accounts WHERE name = 'Smash House' AND password_salt = 'ircom-seed-salt-v1'), 'Smash House', 'г. Цхинвал, ул. Октябрьская, 5', 'https://picsum.photos/seed/smash-burger%2Clogo-806/900/600', '+7(929)732-20-20', '+7(929)732-20-20', NULL),
    ((SELECT account_id FROM accounts WHERE name = 'Мангал №1' AND password_salt = 'ircom-seed-salt-v1'), 'Мангал №1', 'г. Цхинвал, ул. Хетагурова, 18', 'https://picsum.photos/seed/grill%2Crestaurant%2Clogo-807/900/600', '+7(929)622-44-88', NULL, '@mangal_no1'),
    ((SELECT account_id FROM accounts WHERE name = 'Пироговый Дом' AND password_salt = 'ircom-seed-salt-v1'), 'Пироговый Дом', 'г. Цхинвал, ул. Таболова, 9', 'https://picsum.photos/seed/pie%2Cshop%2Clogo-808/900/600', '+7(929)744-66-90', '+7(929)744-66-90', NULL),
    ((SELECT account_id FROM accounts WHERE name = 'Green Bowl' AND password_salt = 'ircom-seed-salt-v1'), 'Green Bowl', 'г. Цхинвал, ул. Московская, 3', 'https://picsum.photos/seed/healthy%2Cbowl%2Clogo-809/900/600', '+7(929)365-50-50', NULL, NULL)
ON CONFLICT (owner_account_id) DO UPDATE SET
     name = EXCLUDED.name
    ,description = EXCLUDED.description
    ,logo_url = EXCLUDED.logo_url
    ,phone = EXCLUDED.phone
    ,whatsapp = EXCLUDED.whatsapp
    ,telegram = EXCLUDED.telegram
    ,updated_at = NOW();

INSERT INTO menu_items (
     restaurant_id
    ,category
    ,name
    ,description
    ,cook_time_minutes
    ,always_in_stock
    ,price
    ,has_delivery
    ,is_available
    ,photos
    ,created_at
    ,updated_at
)
VALUES
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Кафе Тест'), 'Кавказская кухня', 'Суп харчо', 'Наваристый суп с говядиной и рисом.', 18, TRUE, 390, TRUE, TRUE, '["https://picsum.photos/seed/kharcho%2Csoup-490/900/600","https://picsum.photos/seed/soup%2Cbeef-491/900/600"]'::jsonb, NOW() - INTERVAL '0 days', NOW() - INTERVAL '0 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Кафе Тест'), 'Осетинские пироги', 'Пирог с мясом и сыром', 'Сытный пирог с сочной начинкой.', 32, FALSE, 520, TRUE, TRUE, '["https://picsum.photos/seed/ossetian%2Cpie%2Cmeat%2Ccheese-492/900/600","https://picsum.photos/seed/pie%2Cmeat%2Ccheese-493/900/600"]'::jsonb, NOW() - INTERVAL '0 days', NOW() - INTERVAL '0 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пекарня Дарьял'), 'Осетинские пироги', 'Пирог с сыром', 'Тонкое тесто, свежий сыр, 30см.', 35, FALSE, 450, TRUE, TRUE, '["https://picsum.photos/seed/pie%2Cfood-401/900/600","https://picsum.photos/seed/pie%2Ccheese-408/900/600","https://picsum.photos/seed/baked%2Cpie-409/900/600"]'::jsonb, NOW() - INTERVAL '0 days', NOW() - INTERVAL '0 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Sakura Roll'), 'Суши и роллы', 'Филадельфия', 'Классический ролл с лососем.', 30, FALSE, 620, TRUE, TRUE, '["https://picsum.photos/seed/sushi%2Croll-403/900/600","https://picsum.photos/seed/sushi%2Csalmon-412/900/600"]'::jsonb, NOW() - INTERVAL '0 days', NOW() - INTERVAL '0 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Кавказ Двор'), 'Кавказская кухня', 'Шашлык из телятины', 'Маринад по фирменному рецепту.', 45, FALSE, 780, TRUE, TRUE, '["https://picsum.photos/seed/barbecue%2Cmeat-404/900/600","https://picsum.photos/seed/grill%2Ckebab-413/900/600","https://picsum.photos/seed/meat%2Cbbq-414/900/600"]'::jsonb, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пекарня Дарьял'), 'Осетинские пироги', 'Пирог с картофелем', 'Домашний вкус и мягкое тесто.', 25, TRUE, 430, TRUE, TRUE, '["https://picsum.photos/seed/pie%2Cbaked-405/900/600","https://picsum.photos/seed/potato%2Cpie-415/900/600"]'::jsonb, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Burger Point'), 'Бургеры', 'Двойной бургер', 'Двойная котлета и много сыра.', 25, FALSE, 520, FALSE, TRUE, '["https://picsum.photos/seed/double-burger%2Cfood-416/900/600","https://picsum.photos/seed/burger%2Ccheese-417/900/600"]'::jsonb, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Sakura Roll'), 'Суши и роллы', 'Сет Классический', '24 кусочка, подходит на 2-3 человек.', 50, FALSE, 1200, TRUE, TRUE, '["https://picsum.photos/seed/sushi%2Cset-407/900/600","https://picsum.photos/seed/sushi%2Cplatter-419/900/600","https://picsum.photos/seed/japanese%2Cfood-420/900/600"]'::jsonb, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Ocean Sushi Lab'), 'Суши и роллы', 'Калифорния с крабом', 'Лёгкий ролл с крабом и огурцом.', 28, TRUE, 540, TRUE, TRUE, '["https://picsum.photos/seed/california%2Croll-421/900/600","https://picsum.photos/seed/sushi%2Ccrab-422/900/600"]'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Ocean Sushi Lab'), 'Суши и роллы', 'Том ям ролл', 'Острый авторский ролл с креветкой.', 35, FALSE, 710, TRUE, TRUE, '["https://picsum.photos/seed/spicy%2Csushi-423/900/600","https://picsum.photos/seed/roll%2Cshrimp-424/900/600"]'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Ocean Sushi Lab'), 'Суши и роллы', 'Сет Фьюжн', '32 кусочка для компании 3-4 человека.', 55, FALSE, 1550, TRUE, TRUE, '["https://picsum.photos/seed/sushi%2Cassorted-425/900/600","https://picsum.photos/seed/sushi%2Ctable-426/900/600"]'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Smash House'), 'Бургеры', 'Смаш классик', 'Две тонкие котлеты и мягкая булочка бриошь.', 18, TRUE, 460, FALSE, TRUE, '["https://picsum.photos/seed/smash%2Cburger-427/900/600","https://picsum.photos/seed/burger%2Cfries-428/900/600"]'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Smash House'), 'Бургеры', 'BBQ бекон бургер', 'Копчёный бекон, BBQ-соус и хрустящий лук.', 24, FALSE, 590, TRUE, TRUE, '["https://picsum.photos/seed/bbq%2Cburger-429/900/600","https://picsum.photos/seed/bacon%2Cburger-430/900/600"]'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Мангал №1'), 'Кавказская кухня', 'Люля-кебаб из баранины', 'Подаётся с лавашом и маринованным луком.', 40, FALSE, 690, TRUE, TRUE, '["https://picsum.photos/seed/kebab%2Clula-431/900/600","https://picsum.photos/seed/grill%2Ccaucasus-432/900/600"]'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Мангал №1'), 'Кавказская кухня', 'Хачапури по-аджарски', 'Сырная лодочка с яйцом и сливочным маслом.', 30, TRUE, 560, FALSE, TRUE, '["https://picsum.photos/seed/khachapuri%2Cadjara-433/900/600","https://picsum.photos/seed/georgian%2Cfood-434/900/600"]'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пироговый Дом'), 'Осетинские пироги', 'Пирог с мясом', 'Сочный фарш и тонкое поджаристое тесто.', 32, TRUE, 520, TRUE, TRUE, '["https://picsum.photos/seed/meat%2Cpie-435/900/600","https://picsum.photos/seed/ossetian%2Cpie-436/900/600"]'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пироговый Дом'), 'Осетинские пироги', 'Пирог с тыквой', 'Лёгкая сладость и нежная начинка.', 28, FALSE, 410, TRUE, TRUE, '["https://picsum.photos/seed/pumpkin%2Cpie-437/900/600","https://picsum.photos/seed/baked%2Cpumpkin-438/900/600"]'::jsonb, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Green Bowl'), 'Другое', 'Боул с курицей терияки', 'Рис, овощи, соус терияки и кунжут.', 20, TRUE, 640, TRUE, TRUE, '["https://picsum.photos/seed/bowl%2Cteriyaki-439/900/600","https://picsum.photos/seed/healthy%2Cfood-440/900/600"]'::jsonb, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пекарня Дарьял'), 'Осетинские пироги', 'Пирог с зеленью', 'Традиционный осетинский пирог со свежей зеленью.', 26, TRUE, 420, TRUE, TRUE, '["https://picsum.photos/seed/pie%2Cgreens-441/900/600","https://picsum.photos/seed/ossetian%2Cpie%2Cgreens-442/900/600"]'::jsonb, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пекарня Дарьял'), 'Осетинские пироги', 'Пирог с фасолью', 'Насыщенный вкус фасоли и специй.', 30, FALSE, 440, TRUE, TRUE, '["https://picsum.photos/seed/bean%2Cpie-443/900/600","https://picsum.photos/seed/baked%2Cbean%2Cpie-444/900/600"]'::jsonb, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пекарня Дарьял'), 'Осетинские пироги', 'Пирог с капустой', 'Лёгкий овощной пирог на тонком тесте.', 24, TRUE, 400, TRUE, TRUE, '["https://picsum.photos/seed/cabbage%2Cpie-445/900/600","https://picsum.photos/seed/vegetable%2Cpie-446/900/600"]'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Burger Point'), 'Бургеры', 'Бургер с халапеньо', 'Острый бургер с соусом чили и сыром.', 22, FALSE, 480, FALSE, TRUE, '["https://picsum.photos/seed/jalapeno%2Cburger-447/900/600","https://picsum.photos/seed/spicy%2Cburger-448/900/600"]'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Burger Point'), 'Бургеры', 'Грибной бургер', 'Котлета, грибы и сливочный соус.', 23, FALSE, 510, TRUE, TRUE, '["https://picsum.photos/seed/mushroom%2Cburger-449/900/600","https://picsum.photos/seed/burger%2Cmushroom%2Csauce-450/900/600"]'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Burger Point'), 'Бургеры', 'Бургер BBQ', 'Сочный бургер с беконом и BBQ-соусом.', 25, TRUE, 540, TRUE, TRUE, '["https://picsum.photos/seed/bbq%2Cburger%2Csmoke-451/900/600","https://picsum.photos/seed/burger%2Cbacon%2Cbbq-452/900/600"]'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Sakura Roll'), 'Суши и роллы', 'Запечённый ролл с угрём', 'Тёплый ролл с соусом унаги и сыром.', 34, FALSE, 690, TRUE, TRUE, '["https://picsum.photos/seed/baked%2Csushi%2Ceel-453/900/600","https://picsum.photos/seed/eel%2Croll-454/900/600"]'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Sakura Roll'), 'Суши и роллы', 'Ролл с тунцом', 'Классический ролл с тунцом и огурцом.', 27, TRUE, 610, TRUE, TRUE, '["https://picsum.photos/seed/tuna%2Croll-455/900/600","https://picsum.photos/seed/sushi%2Ctuna-456/900/600"]'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Sakura Roll'), 'Суши и роллы', 'Сет Лайт', '20 кусочков для лёгкого ужина.', 42, FALSE, 980, TRUE, TRUE, '["https://picsum.photos/seed/sushi%2Cset%2Clight-457/900/600","https://picsum.photos/seed/japanese%2Cset-458/900/600"]'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Ocean Sushi Lab'), 'Суши и роллы', 'Ролл с лососем и манго', 'Авторский ролл со сладкими нотами манго.', 33, FALSE, 760, TRUE, TRUE, '["https://picsum.photos/seed/salmon%2Cmango%2Croll-459/900/600","https://picsum.photos/seed/fusion%2Csushi-460/900/600"]'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Ocean Sushi Lab'), 'Суши и роллы', 'Сет Океан', 'Большой сет из 40 кусочков.', 58, FALSE, 1680, TRUE, TRUE, '["https://picsum.photos/seed/ocean%2Csushi%2Cset-461/900/600","https://picsum.photos/seed/sushi%2Cbig%2Cset-462/900/600"]'::jsonb, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Ocean Sushi Lab'), 'Суши и роллы', 'Темпура ролл с креветкой', 'Хрустящий ролл в темпуре.', 36, TRUE, 720, TRUE, TRUE, '["https://picsum.photos/seed/tempura%2Cshrimp%2Croll-463/900/600","https://picsum.photos/seed/crispy%2Csushi-464/900/600"]'::jsonb, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Мангал №1'), 'Кавказская кухня', 'Шашлык из курицы', 'Нежное куриное филе на углях.', 34, TRUE, 590, TRUE, TRUE, '["https://picsum.photos/seed/chicken%2Cbbq-465/900/600","https://picsum.photos/seed/grill%2Cchicken-466/900/600"]'::jsonb, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Мангал №1'), 'Кавказская кухня', 'Овощи на гриле', 'Баклажан, перец и томаты на мангале.', 20, TRUE, 390, TRUE, TRUE, '["https://picsum.photos/seed/grilled%2Cvegetables-467/900/600","https://picsum.photos/seed/vegetable%2Cplate-468/900/600"]'::jsonb, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Мангал №1'), 'Кавказская кухня', 'Хинкали с говядиной', 'Сочные хинкали с бульоном внутри.', 28, FALSE, 520, FALSE, TRUE, '["https://picsum.photos/seed/khinkali%2Cbeef-469/900/600","https://picsum.photos/seed/georgian%2Ckhinkali-470/900/600"]'::jsonb, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пироговый Дом'), 'Осетинские пироги', 'Пирог с сыром и картофелем', 'Классическое сочетание сыра и картофеля.', 29, TRUE, 470, TRUE, TRUE, '["https://picsum.photos/seed/pie%2Ccheese%2Cpotato-471/900/600","https://picsum.photos/seed/ossetian%2Cbaked%2Cpie-472/900/600"]'::jsonb, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Пироговый Дом'), 'Осетинские пироги', 'Пирог с яблоком', 'Сладкий пирог с яблочной начинкой.', 27, FALSE, 430, TRUE, TRUE, '["https://picsum.photos/seed/apple%2Cpie%2Csweet-473/900/600","https://picsum.photos/seed/dessert%2Cpie-474/900/600"]'::jsonb, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Green Bowl'), 'Другое', 'Боул с лососем', 'Рис, лосось, авокадо и соус понзу.', 22, FALSE, 790, TRUE, TRUE, '["https://picsum.photos/seed/salmon%2Cbowl-475/900/600","https://picsum.photos/seed/healthy%2Csalmon%2Cbowl-476/900/600"]'::jsonb, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Green Bowl'), 'Другое', 'Веган боул', 'Киноа, хумус, овощи и семечки.', 18, TRUE, 560, TRUE, TRUE, '["https://picsum.photos/seed/vegan%2Cbowl-477/900/600","https://picsum.photos/seed/quinoa%2Cbowl-478/900/600"]'::jsonb, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Smash House'), 'Бургеры', 'Смаш с трюфельным соусом', 'Авторский бургер с трюфельным айоли.', 26, FALSE, 650, TRUE, TRUE, '["https://picsum.photos/seed/truffle%2Csmash%2Cburger-479/900/600","https://picsum.photos/seed/gourmet%2Cburger-480/900/600"]'::jsonb, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Smash House'), 'Бургеры', 'Чикен смаш', 'Куриная котлета, сыр чеддер и салат.', 19, TRUE, 430, FALSE, TRUE, '["https://picsum.photos/seed/chicken%2Csmash-481/900/600","https://picsum.photos/seed/burger%2Cchicken-482/900/600"]'::jsonb, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
    ((SELECT restaurant_id FROM restaurants WHERE name = 'Smash House'), 'Бургеры', 'Смаш двойной острый', 'Двойная котлета, перцы халапеньо и соус.', 24, FALSE, 610, TRUE, TRUE, '["https://picsum.photos/seed/double%2Cspicy%2Csmash-483/900/600","https://picsum.photos/seed/hot%2Cburger-484/900/600"]'::jsonb, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days');

SET search_path TO public;
