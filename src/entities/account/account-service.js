const {Story} = require('story-system');
const crypto = require('crypto');
const {
    createAccount,
    getAuthAccountByLogin,
    createSession,
    getSession,
    signOut,
    createOrUpdateAccount,
    getProfile,
} = require('./queries.js');

const hashPassword = (password, salt) => crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
const createSalt = () => crypto.randomBytes(16).toString('hex');
const createSessionToken = () => crypto.randomBytes(32).toString('hex');

class AccountService {
    async register({params}) {
        const phone = String(params.phone || '').trim();
        if (!phone) {
            throw new Error('Phone is required');
        }

        const passwordSalt = createSalt();
        const passwordHash = hashPassword(params.password, passwordSalt);
        let account;

        try {
            account = await Story.dbAdapter.execQuery({
                queryName: createAccount,
                params: {
                    name: params.name,
                    nickname: params.nickname || null,
                    phone,
                    passwordHash,
                    passwordSalt,
                    whatsapp: params.whatsapp || null,
                    telegram: params.telegram || null,
                },
                options: {
                    singularRow: true,
                },
            });
        } catch (error) {
            if (error && error.code === '23505') {
                throw new Error('Account with this phone or nickname already exists');
            }
            throw error;
        }

        const sessionToken = createSessionToken();
        const session = await Story.dbAdapter.execQuery({
            queryName: createSession,
            params: {
                accountId: account.accountId,
                sessionToken,
            },
            options: {
                singularRow: true,
            },
        });

        return {
            sessionToken: session.sessionToken,
            expiresAt: session.expiresAt,
            account,
        };
    }

    async signIn({params}) {
        const authAccount = await Story.dbAdapter.execQuery({
            queryName: getAuthAccountByLogin,
            params: {
                login: params.login,
            },
            options: {
                singularRow: true,
            },
        });

        if (!authAccount) {
            throw new Error('Invalid login or password');
        }

        const actualHash = hashPassword(params.password, authAccount.passwordSalt);
        const isPasswordValid = crypto.timingSafeEqual(
            Buffer.from(actualHash, 'hex'),
            Buffer.from(authAccount.passwordHash, 'hex'),
        );

        if (!isPasswordValid) {
            throw new Error('Invalid login or password');
        }

        const sessionToken = createSessionToken();
        const session = await Story.dbAdapter.execQuery({
            queryName: createSession,
            params: {
                accountId: authAccount.accountId,
                sessionToken,
            },
            options: {
                singularRow: true,
            },
        });

        return {
            sessionToken: session.sessionToken,
            expiresAt: session.expiresAt,
            account: {
                accountId: authAccount.accountId,
                name: authAccount.name,
                nickname: authAccount.nickname,
                phone: authAccount.phone,
                whatsapp: authAccount.whatsapp,
                telegram: authAccount.telegram,
            },
        };
    }

    getSession({params}) {
        return Story.dbAdapter.execQuery({
            queryName: getSession,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    signOut({params}) {
        return Story.dbAdapter.execQuery({
            queryName: signOut,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    createOrUpdateAccount({params}) {
        return Story.dbAdapter.execQuery({
            queryName: createOrUpdateAccount,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getProfile({params}) {
        return Story.dbAdapter.execQuery({
            queryName: getProfile,
            params,
            options: {
                singularRow: true,
            },
        });
    }
}

module.exports = {AccountService};
