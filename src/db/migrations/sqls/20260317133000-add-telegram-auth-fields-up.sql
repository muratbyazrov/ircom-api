SET search_path TO public;

ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS login TEXT,
    ADD COLUMN IF NOT EXISTS telegram_user_id BIGINT;

CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_login_ci
    ON accounts (LOWER(login))
    WHERE login IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_telegram_user_id
    ON accounts (telegram_user_id)
    WHERE telegram_user_id IS NOT NULL;

SET search_path TO public;
