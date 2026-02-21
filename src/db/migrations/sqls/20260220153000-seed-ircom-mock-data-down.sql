SET search_path TO public;

DELETE FROM menu_item_favorites
WHERE
    account_id IN (
        SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
    )
    OR menu_item_id IN (
        SELECT m.menu_item_id
        FROM menu_items AS m
        INNER JOIN restaurants AS r ON r.restaurant_id = m.restaurant_id
        INNER JOIN accounts AS a ON a.account_id = r.owner_account_id
        WHERE a.password_salt = 'ircom-seed-salt-v1'
    );

DELETE FROM menu_items
WHERE restaurant_id IN (
    SELECT r.restaurant_id
    FROM restaurants AS r
    INNER JOIN accounts AS a ON a.account_id = r.owner_account_id
    WHERE a.password_salt = 'ircom-seed-salt-v1'
);

DELETE FROM restaurants
WHERE owner_account_id IN (
    SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
);

DELETE FROM taxi_favorites
WHERE
    account_id IN (
        SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
    )
    OR taxi_offer_id IN (
        SELECT t.taxi_offer_id
        FROM taxi_offers AS t
        INNER JOIN accounts AS a ON a.account_id = t.owner_account_id
        WHERE a.password_salt = 'ircom-seed-salt-v1'
    );

DELETE FROM taxi_offers
WHERE owner_account_id IN (
    SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
);

DELETE FROM listing_favorites
WHERE
    account_id IN (
        SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
    )
    OR listing_id IN (
        SELECT l.listing_id
        FROM listings AS l
        INNER JOIN accounts AS a ON a.account_id = l.owner_account_id
        WHERE a.password_salt = 'ircom-seed-salt-v1'
    );

DELETE FROM listings
WHERE owner_account_id IN (
    SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
);

DELETE FROM account_sessions
WHERE account_id IN (
    SELECT account_id FROM accounts WHERE password_salt = 'ircom-seed-salt-v1'
);

DELETE FROM accounts
WHERE password_salt = 'ircom-seed-salt-v1';

SET search_path TO public;
