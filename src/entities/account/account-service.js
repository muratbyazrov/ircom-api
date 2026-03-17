const {Story} = require('story-system');
const crypto = require('crypto');
const https = require('https');
const {promisify} = require('util');
const {
    createAccount,
    getAuthAccountByPhone,
    getAuthAccountByLogin,
    getAccountByTelegramUserId,
    updateTelegramContact,
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
const TELEGRAM_LOGIN_PATTERN = /^[a-z0-9_]{3,64}$/;
const TELEGRAM_USERNAME_AS_LOGIN_MIN_LENGTH = 4;
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

const normalizeLogin = value => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().replace(/^@+/, '').toLowerCase();
};

const buildAccountName = user => {
    const parts = [user?.first_name, user?.last_name]
        .map(value => String(value || '').trim())
        .filter(Boolean);
    if (parts.length) {
        return parts.join(' ').slice(0, 80);
    }

    const username = normalizeLogin(user?.username);
    if (username) {
        return username.slice(0, 80);
    }

    return 'Пользователь Telegram';
};

const createMemorablePassword = () => {
    const left = ['mira', 'luna', 'nora', 'sima', 'toma', 'rita', 'leva', 'timu'];
    const right = ['fox', 'star', 'wind', 'moon', 'sun', 'wave', 'bird', 'hill'];
    const digits = String(Math.floor(Math.random() * 90) + 10);
    const leftPart = left[Math.floor(Math.random() * left.length)];
    const rightPart = right[Math.floor(Math.random() * right.length)];
    return `${leftPart}${rightPart}${digits}`;
};

const createGeneratedLogin = telegramUserId => `user${String(telegramUserId).slice(-6)}`;

const getTelegramBotToken = () => String(
    process.env.TELEGRAM_BOT_TOKEN
    || process.env.BOT_TOKEN
    || ''
).trim();

const parseTelegramInitData = initData => {
    const botToken = getTelegramBotToken();
    if (!botToken) {
        throw new Story.errors.BadRequestError('Telegram auth is not configured on server');
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) {
        throw new Story.errors.Forbidden('Некорректные данные Telegram');
    }

    const dataCheckString = [...params.entries()]
        .filter(([key]) => key !== 'hash')
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secret = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(dataCheckString)
        .digest('hex');

    if (expectedHash !== hash) {
        throw new Story.errors.Forbidden('Некорректные данные Telegram');
    }

    const rawUser = params.get('user');
    if (!rawUser) {
        throw new Story.errors.BadRequestError('В Telegram не найден профиль пользователя');
    }

    let user;
    try {
        user = JSON.parse(rawUser);
    } catch (error) {
        throw new Story.errors.BadRequestError('Не удалось прочитать профиль Telegram');
    }

    return {params, user};
};

const sendTelegramMessage = async ({chatId, text}) => {
    const botToken = getTelegramBotToken();
    if (!botToken) {
        throw new Story.errors.BadRequestError('Telegram bot token is missing');
    }

    const payload = JSON.stringify({
        chat_id: chatId,
        text,
    });

    await new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.telegram.org',
            path: `/bot${botToken}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
        }, res => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                    return;
                }

                reject(new Error(body || `Telegram API error: ${res.statusCode}`));
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
};

const ensureUniqueLogin = async ({baseLogin, telegramUserId}) => {
    if (!baseLogin) {
        return '';
    }

    const candidates = [
        baseLogin,
        `${baseLogin}${String(telegramUserId).slice(-4)}`,
        `${baseLogin}_${String(telegramUserId).slice(-4)}`,
    ];

    for (const candidate of candidates) {
        const occupiedLogin = await Story.dbAdapter.execQuery({
            queryName: getAuthAccountByLogin,
            params: {login: candidate},
            options: {
                singularRow: true,
            },
        });
        if (!occupiedLogin) {
            return candidate;
        }
    }

    return `${baseLogin}_${telegramUserId}`;
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
                    login: null,
                    phone,
                    passwordHash,
                    passwordSalt,
                    whatsapp: params.whatsapp || null,
                    telegram: params.telegram || null,
                    telegramUserId: null,
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
        const login = normalizeLogin(params.login);

        if (!phone && !login) {
            throw new Story.errors.Forbidden('Введите телефон или логин');
        }
        const authAccount = await Story.dbAdapter.execQuery({
            queryName: login ? getAuthAccountByLogin : getAuthAccountByPhone,
            params: login ? {login} : {phone},
            options: {
                singularRow: true,
            },
        });

        if (!authAccount) {
            throw new Story.errors.Forbidden('Неверный телефон, логин или пароль');
        }

        const actualHash = await hashPassword(params.password, authAccount.passwordSalt);
        const isPasswordValid = safeCompareHexHashes(actualHash, authAccount.passwordHash);

        if (!isPasswordValid) {
            throw new Story.errors.Forbidden('Неверный телефон, логин или пароль');
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
                login: authAccount.login,
                phone: authAccount.phone,
                whatsapp: authAccount.whatsapp,
                telegram: authAccount.telegram,
                telegramUserId: authAccount.telegramUserId,
            },
        };
    }

    async telegramAuth({params}) {
        const {user} = parseTelegramInitData(params.initData);
        const telegramUserId = Number(user?.id);
        const telegramUsername = normalizeLogin(user?.username);
        const phone = normalizePhone(params.phone || user?.phone_number);
        const telegramContact = telegramUsername ? `@${telegramUsername}` : null;
        const canUseUsernameAsLogin = Boolean(
            telegramUsername
            && telegramUsername.length >= TELEGRAM_USERNAME_AS_LOGIN_MIN_LENGTH
            && TELEGRAM_LOGIN_PATTERN.test(telegramUsername)
        );

        if (!Number.isFinite(telegramUserId) || telegramUserId <= 0) {
            throw new Story.errors.BadRequestError('В Telegram не найден корректный id пользователя');
        }

        const existingAccount = await Story.dbAdapter.execQuery({
            queryName: getAccountByTelegramUserId,
            params: {
                telegramUserId,
            },
            options: {
                singularRow: true,
            },
        });

        if (existingAccount) {
            const accountForSession = telegramContact && existingAccount.telegram !== telegramContact
                ? await Story.dbAdapter.execQuery({
                    queryName: updateTelegramContact,
                    params: {
                        accountId: existingAccount.accountId,
                        telegram: telegramContact,
                    },
                    options: {
                        singularRow: true,
                    },
                })
                : existingAccount;
            const sessionToken = createSessionToken();
            const session = await Story.dbAdapter.execQuery({
                queryName: createSession,
                params: {
                    accountId: accountForSession.accountId,
                    sessionToken,
                },
                options: {
                    singularRow: true,
                },
            });

            return {
                sessionToken: session.sessionToken,
                expiresAt: session.expiresAt,
                account: accountForSession,
                isNewAccount: false,
                credentialsSent: false,
            };
        }

        let login = canUseUsernameAsLogin ? telegramUsername : createGeneratedLogin(telegramUserId);
        login = await ensureUniqueLogin({baseLogin: login, telegramUserId});

        const generatedPassword = createMemorablePassword();
        const passwordSalt = createSalt();
        const passwordHash = await hashPassword(generatedPassword, passwordSalt);
        const name = buildAccountName(user);

        let account;
        try {
            account = await Story.dbAdapter.execQuery({
                queryName: createAccount,
                params: {
                    name,
                    login: login || null,
                    phone: phone || null,
                    passwordHash,
                    passwordSalt,
                    whatsapp: phone || null,
                    telegram: telegramContact,
                    telegramUserId,
                },
                options: {
                    singularRow: true,
                },
            });
        } catch (error) {
            if (error && error.code === '23505') {
                throw new Story.errors.BadRequestError(
                    'Не удалось автоматически создать аккаунт. Такой телефон, логин или Telegram уже используется.'
                );
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

        const loginLabel = phone || account.login;
        let credentialsSent = false;
        if (loginLabel) {
            const message = [
                'Ваш аккаунт в IRCOM готов.',
                '',
                `Логин: ${loginLabel}`,
                `Пароль: ${generatedPassword}`,
                '',
                'Сохраните эти данные. Ими можно войти вручную в приложении.',
            ].join('\n');

            try {
                await sendTelegramMessage({
                    chatId: telegramUserId,
                    text: message,
                });
                credentialsSent = true;
            } catch (error) {
                Story.logger && Story.logger.error && Story.logger.error(error);
            }
        }

        return {
            sessionToken: session.sessionToken,
            expiresAt: session.expiresAt,
            account,
            isNewAccount: true,
            credentialsSent,
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
