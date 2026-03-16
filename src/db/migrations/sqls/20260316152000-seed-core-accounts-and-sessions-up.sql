SET search_path TO public;

INSERT INTO accounts (
    account_id,
    name,
    phone,
    password_hash,
    password_salt,
    whatsapp,
    telegram,
    created_at,
    updated_at
)
VALUES
    (34, 'Мурат', '+7(966)094-50-67', 'b8c13c12828423773a84409e4d3842a50783810745131cb3e00df41b3034580409946cee41bd950ffb998c3c801dda142dc188d35e1b3f16ddf1d3c30838639e', '99c282d5d30bcb9dcb01294ef86f84d9', NULL, NULL, '2026-02-24 19:06:27.255166 +00:00', '2026-02-24 19:06:27.255166 +00:00'),
    (35, 'Анна', '+7(925)169-91-15', 'db6a68d6232518355fe98624a0a0cb0e1c7445d6d50235c753289b45415520d3cc3ba231b3086708f141ea515f5ed969cbf6f41256699f5a8e7757312adc6501', '0fed12f5d322b4207a1a3d6909c8758c', NULL, NULL, '2026-02-28 07:42:28.516864 +00:00', '2026-02-28 07:42:28.516864 +00:00'),
    (36, 'Ден', '+7(929)807-91-64', '5795a4d3816253c2beabadd793f97faf59cbafd6f93397b9935ceb10419fa64fe67e4385dc4b80f34a880fd3a6f9fb04b607d82713dddf2a47d6695016548139', '12a9155eabfe95af2c50ec7561bea03d', NULL, NULL, '2026-03-01 15:20:49.213511 +00:00', '2026-03-01 15:20:49.213511 +00:00'),
    (37, 'Батыраж', '+7(915)471-48-21', '5f780de16ee5d2a916fcba8bb3547ceabd5441a1515c10f3a57848568e10e915438e7372b4d9e5504931ed1465f7b18886d07d5c1387ddc394171bebcef65857', '3483d98f499f53016417a1c90ce95fc8', NULL, NULL, '2026-03-03 07:45:38.533276 +00:00', '2026-03-03 07:45:38.533276 +00:00'),
    (38, 'Анатолий', '+7(988)873-02-15', '3adfea917b605f4c91a042adcfa654ed7d3db5069b0927dbea4ae64c12072fadc782b0bcfd4bcb1cac080c0f7747a210e3447bcaf9619367070435a68aea52c9', '45f8b3eb3219767602a27b9197cee931', NULL, NULL, '2026-03-04 10:21:53.162241 +00:00', '2026-03-04 10:21:53.162241 +00:00')
ON CONFLICT (account_id) DO UPDATE
SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    password_hash = EXCLUDED.password_hash,
    password_salt = EXCLUDED.password_salt,
    whatsapp = EXCLUDED.whatsapp,
    telegram = EXCLUDED.telegram,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at;

SELECT setval(
    pg_get_serial_sequence('accounts', 'account_id'),
    GREATEST(COALESCE((SELECT MAX(account_id) FROM accounts), 1), 1),
    TRUE
);

INSERT INTO account_sessions (
    account_session_id,
    account_id,
    token,
    expires_at,
    created_at
)
VALUES
    (1, 34, 'c5bd99b11dc1889deb8879c6b5798f9e3182b4749c4a941ec6e4b1f59611b672', '2026-03-26 19:06:27.260534 +00:00', '2026-02-24 19:06:27.260534 +00:00'),
    (5, 35, 'e4ef34c06c7fe6cc3e5e0256eb43019ec7366324b3892a99eda6344921ec0af2', '2026-03-30 07:42:28.521868 +00:00', '2026-02-28 07:42:28.521868 +00:00'),
    (8, 34, 'f1d84960104bc325175e1fea12598595d11f6d559f34b5c1ffd6f4b2cf116b0d', '2026-03-30 18:06:26.869809 +00:00', '2026-02-28 18:06:26.869809 +00:00'),
    (10, 36, '7d057e95638c291dc9b0eea0411d2b5107aa8f2bf796192e0b6bb54ee89964f5', '2026-03-31 15:20:49.221696 +00:00', '2026-03-01 15:20:49.221696 +00:00'),
    (11, 37, '285abdf28005835709d7c7064e0fcc91cb308658ca13a8a4b1aab303ed1db43a', '2026-04-02 07:45:38.539381 +00:00', '2026-03-03 07:45:38.539381 +00:00'),
    (12, 38, '137ad9d48be6dba3ac07a08a90697f9305a027c84664472b85fa0a85b1467d01', '2026-04-03 10:21:53.167151 +00:00', '2026-03-04 10:21:53.167151 +00:00'),
    (13, 38, 'ea2e48ddb15ed29311eb4c571e29a55bc972389af817f962fc7ec405084ada4e', '2026-04-03 13:42:38.242357 +00:00', '2026-03-04 13:42:38.242357 +00:00')
ON CONFLICT (account_session_id) DO UPDATE
SET
    account_id = EXCLUDED.account_id,
    token = EXCLUDED.token,
    expires_at = EXCLUDED.expires_at,
    created_at = EXCLUDED.created_at;

SELECT setval(
    pg_get_serial_sequence('account_sessions', 'account_session_id'),
    GREATEST(COALESCE((SELECT MAX(account_session_id) FROM account_sessions), 1), 1),
    TRUE
);

SET search_path TO public;
