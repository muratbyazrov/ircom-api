SET search_path TO public;

ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS telegram_credentials_sent_at TIMESTAMPTZ;

SET search_path TO public;
