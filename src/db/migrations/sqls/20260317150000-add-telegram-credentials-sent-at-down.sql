SET search_path TO public;

ALTER TABLE accounts
    DROP COLUMN IF EXISTS telegram_credentials_sent_at;

SET search_path TO public;
