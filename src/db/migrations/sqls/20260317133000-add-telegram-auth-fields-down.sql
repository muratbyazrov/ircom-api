SET search_path TO public;

DROP INDEX IF EXISTS ux_accounts_telegram_user_id;
DROP INDEX IF EXISTS ux_accounts_login_ci;

ALTER TABLE accounts
    DROP COLUMN IF EXISTS telegram_user_id,
    DROP COLUMN IF EXISTS login;

SET search_path TO public;
