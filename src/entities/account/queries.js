module.exports = {
    createAccount: `
        INSERT INTO accounts (
             name
            ,nickname
            ,phone
            ,password_hash
            ,password_salt
            ,whatsapp
            ,telegram
        )
        VALUES (
             :name
            ,:nickname
            ,:phone
            ,:passwordHash
            ,:passwordSalt
            ,:whatsapp
            ,:telegram
        )
        RETURNING
             account_id AS "accountId"
            ,name
            ,nickname
            ,phone
            ,whatsapp
            ,telegram
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    getAuthAccountByPhone: `
        SELECT
             account_id AS "accountId"
            ,name
            ,nickname
            ,phone
            ,whatsapp
            ,telegram
            ,password_hash AS "passwordHash"
            ,password_salt AS "passwordSalt"
        FROM
            accounts
        WHERE
            phone = :phone
        LIMIT 1;`,

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
            ,a.nickname
            ,a.phone
            ,a.whatsapp
            ,a.telegram
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
            ,nickname = :nickname
            ,phone = :phone
            ,whatsapp = :whatsapp
            ,telegram = :telegram
            ,updated_at = NOW()
        WHERE
            account_id = :accountId
        RETURNING
             account_id AS "accountId"
            ,name
            ,nickname
            ,phone
            ,whatsapp
            ,telegram
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    getProfile: `
        SELECT
             account_id AS "accountId"
            ,name
            ,nickname
            ,phone
            ,whatsapp
            ,telegram
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt"
        FROM
            accounts
        WHERE
            account_id = :accountId;`,
};
