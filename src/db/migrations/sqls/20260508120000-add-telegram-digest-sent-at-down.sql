ALTER TABLE accounts
    DROP COLUMN IF EXISTS telegram_digest_sent_at,
    DROP COLUMN IF EXISTS telegram_digest_frequency;
