ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS telegram_digest_sent_at  TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS telegram_digest_frequency TEXT NOT NULL DEFAULT 'daily';
