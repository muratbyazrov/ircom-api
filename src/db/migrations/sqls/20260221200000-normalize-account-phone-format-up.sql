DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'accounts_phone_no_spaces_chk'
    ) THEN
        ALTER TABLE accounts
            ADD CONSTRAINT accounts_phone_no_spaces_chk
            CHECK (phone IS NULL OR phone !~ '\s')
            NOT VALID;
    END IF;
END $$;

WITH normalized AS (
    SELECT
        a.account_id,
        NULLIF(regexp_replace(a.phone, '\s+', '', 'g'), '') AS phone_norm
    FROM accounts AS a
    WHERE a.phone IS NOT NULL
),
safe_unique AS (
    SELECT
        n.account_id,
        n.phone_norm
    FROM normalized AS n
    INNER JOIN (
        SELECT phone_norm
        FROM normalized
        WHERE phone_norm IS NOT NULL
        GROUP BY phone_norm
        HAVING COUNT(*) = 1
    ) AS uniq ON uniq.phone_norm = n.phone_norm
)
UPDATE accounts AS a
SET phone = s.phone_norm
FROM safe_unique AS s
WHERE a.account_id = s.account_id
  AND a.phone IS DISTINCT FROM s.phone_norm;
