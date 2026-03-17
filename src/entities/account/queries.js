module.exports = {
    createAccount: `
        INSERT INTO accounts (
             name
            ,login
            ,phone
            ,password_hash
            ,password_salt
            ,whatsapp
            ,telegram
            ,telegram_user_id
        )
        VALUES (
             :name
            ,:login
            ,:phone
            ,:passwordHash
            ,:passwordSalt
            ,:whatsapp
            ,:telegram
            ,:telegramUserId
        )
        RETURNING
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    getAuthAccountByPhone: `
        SELECT
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,password_hash AS "passwordHash"
            ,password_salt AS "passwordSalt"
        FROM
            accounts
        WHERE
            regexp_replace(COALESCE(phone, ''), '\s+', '', 'g') = :phone
        LIMIT 1;`,

    getAuthAccountByLogin: `
        SELECT
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,password_hash AS "passwordHash"
            ,password_salt AS "passwordSalt"
        FROM
            accounts
        WHERE
            LOWER(COALESCE(login, '')) = LOWER(:login)
        LIMIT 1;`,

    getAccountByTelegramUserId: `
        SELECT
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt"
        FROM
            accounts
        WHERE
            telegram_user_id = :telegramUserId
        LIMIT 1;`,

    updateTelegramContact: `
        UPDATE accounts
        SET
             telegram = :telegram
            ,updated_at = NOW()
        WHERE
            account_id = :accountId
        RETURNING
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    createSession: `
        INSERT INTO account_sessions (
             account_id
            ,token
            ,expires_at
        )
        VALUES (
             :accountId
            ,:sessionToken
            ,NOW() + INTERVAL '30 days'
        )
        RETURNING
             token AS "sessionToken"
            ,expires_at AS "expiresAt";`,

    getSession: `
        SELECT
             s.token AS "sessionToken"
            ,s.expires_at AS "expiresAt"
            ,a.account_id AS "accountId"
            ,a.name
            ,a.login
            ,a.phone
            ,a.whatsapp
            ,a.telegram
            ,a.telegram_user_id AS "telegramUserId"
        FROM
            account_sessions AS s
            INNER JOIN accounts AS a ON a.account_id = s.account_id
        WHERE
            s.token = :sessionToken
            AND s.expires_at > NOW()
        LIMIT 1;`,

    signOut: `
        DELETE FROM account_sessions
        WHERE token = :sessionToken
        RETURNING token AS "sessionToken";`,

    createOrUpdateAccount: `
        UPDATE accounts
        SET
             name = :name
            ,phone = :phone
            ,whatsapp = :whatsapp
            ,telegram = :telegram
            ,updated_at = NOW()
        WHERE
            account_id = :accountId
        RETURNING
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    getProfile: `
        SELECT
             account_id AS "accountId"
            ,name
            ,login
            ,phone
            ,whatsapp
            ,telegram
            ,telegram_user_id AS "telegramUserId"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt"
        FROM
            accounts
        WHERE
            account_id = :accountId;`,
};
