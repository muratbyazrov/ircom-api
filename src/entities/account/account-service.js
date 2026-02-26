const {Story} = require('story-system');
const crypto = require('crypto');
const {promisify} = require('util');
const {
    createAccount,
    getAuthAccountByPhone,
    createSession,
    getSession,
    signOut,
    createOrUpdateAccount,
    getProfile,
} = require('./queries.js');

const pbkdf2Async = promisify(crypto.pbkdf2);
const hashPassword = async (password, salt) => {
    const derivedKey = await pbkdf2Async(password, salt, 100000, 64, 'sha512');
    return derivedKey.toString('hex');
};
const createSalt = () => crypto.randomBytes(16).toString('hex');
const createSessionToken = () => crypto.randomBytes(32).toString('hex');
const isHexHash = value => typeof value === 'string' && /^[a-f0-9]+$/i.test(value) && value.length % 2 === 0;
const safeCompareHexHashes = (left, right) => {
    if (!isHexHash(left) || !isHexHash(right)) {
        return false;
    }
    if (left.length !== right.length) {
        return false;
    }
    return crypto.timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
};

const normalizePhone = value => {
    if (typeof value !== 'string') {
        return '';
    }

    // Store phone in a single canonical representation without spaces.
    return value.replace(/\s+/g, '').trim();
};

class AccountService {
    async register({params}) {
        const phone = normalizePhone(params.phone);
        if (!phone) {
            throw new Story.errors.BadRequestError('Телефон обязателен');
        }

        const passwordSalt = createSalt();
        const passwordHash = await hashPassword(params.password, passwordSalt);
        let account;

        try {
            account = await Story.dbAdapter.execQuery({
                queryName: createAccount,
                params: {
                    name: params.name,
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
                throw new Story.errors.BadRequestError('Аккаунт с таким номером телефона уже существует');
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
        const phone = normalizePhone(params.phone);
        if (!phone) {
            throw new Story.errors.Forbidden('Неверный номер телефона или пароль');
        }
        const authAccount = await Story.dbAdapter.execQuery({
            queryName: getAuthAccountByPhone,
            params: {
                phone,
            },
            options: {
                singularRow: true,
            },
        });

        if (!authAccount) {
            throw new Story.errors.Forbidden('Неверный номер телефона или пароль');
        }

        const actualHash = await hashPassword(params.password, authAccount.passwordSalt);
        const isPasswordValid = safeCompareHexHashes(actualHash, authAccount.passwordHash);

        if (!isPasswordValid) {
            throw new Story.errors.Forbidden('Неверный номер телефона или пароль');
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
        const queryParams = {
            ...params,
            phone: params.phone === null || typeof params.phone === 'undefined' ?
                null :
                normalizePhone(params.phone),
        };

        return Story.dbAdapter.execQuery({
            queryName: createOrUpdateAccount,
            params: queryParams,
            options: {
                singularRow: true,
            },
        }).catch(error => {
            if (error && error.code === '23505') {
                throw new Story.errors.BadRequestError('Аккаунт с таким номером телефона уже существует');
            }
            throw error;
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
