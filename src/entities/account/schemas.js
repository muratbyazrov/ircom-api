const {Story: {validator: {schemaItems: {number1, string1}}}} = require('story-system');

const ACCOUNT_NAME_MIN = 2;
const ACCOUNT_NAME_MAX = 60;
const ACCOUNT_PHONE_MIN = 6;
const ACCOUNT_PHONE_MAX = 20;
const ACCOUNT_PASSWORD_MIN = 6;
const ACCOUNT_PASSWORD_MAX = 128;
const ACCOUNT_LOGIN_MIN = 3;
const ACCOUNT_LOGIN_MAX = 40;
const ACCOUNT_TELEGRAM_MAX = 64;

const nullablePhone = {
    anyOf: [
        {type: 'null'},
        {
            type: 'string',
            minLength: ACCOUNT_PHONE_MIN,
            maxLength: ACCOUNT_PHONE_MAX,
        },
    ],
};

const nullableWhatsapp = {
    anyOf: [
        {type: 'null'},
        {
            type: 'string',
            minLength: 1,
            maxLength: ACCOUNT_PHONE_MAX,
        },
    ],
};

const nullableTelegram = {
    anyOf: [
        {type: 'null'},
        {
            type: 'string',
            minLength: 1,
            maxLength: ACCOUNT_TELEGRAM_MAX,
        },
    ],
};

const registerSchema = {
    id: 'registerSchema',
    additionalProperties: false,
    required: ['name', 'phone', 'password'],
    properties: {
        name: {
            type: 'string',
            minLength: ACCOUNT_NAME_MIN,
            maxLength: ACCOUNT_NAME_MAX,
        },
        phone: {
            type: 'string',
            minLength: ACCOUNT_PHONE_MIN,
            maxLength: ACCOUNT_PHONE_MAX,
        },
        password: {
            type: 'string',
            minLength: ACCOUNT_PASSWORD_MIN,
            maxLength: ACCOUNT_PASSWORD_MAX,
        },
        whatsapp: nullableWhatsapp,
        telegram: nullableTelegram,
    },
};

const signInSchema = {
    id: 'signInSchema',
    additionalProperties: false,
    required: ['password'],
    properties: {
        phone: {
            type: 'string',
            minLength: ACCOUNT_PHONE_MIN,
            maxLength: ACCOUNT_PHONE_MAX,
        },
        login: {
            type: 'string',
            minLength: ACCOUNT_LOGIN_MIN,
            maxLength: ACCOUNT_LOGIN_MAX,
        },
        password: {
            type: 'string',
            minLength: ACCOUNT_PASSWORD_MIN,
            maxLength: ACCOUNT_PASSWORD_MAX,
        },
    },
};

const telegramAuthSchema = {
    id: 'telegramAuthSchema',
    additionalProperties: false,
    required: ['initData'],
    properties: {
        initData: string1,
        phone: nullablePhone,
    },
};

const getSessionSchema = {
    id: 'getSessionSchema',
    additionalProperties: false,
    required: ['sessionToken'],
    properties: {
        sessionToken: string1,
    },
};

const signOutSchema = {
    id: 'signOutSchema',
    additionalProperties: false,
    required: ['sessionToken'],
    properties: {
        sessionToken: string1,
    },
};

const createOrUpdateAccountSchema = {
    id: 'createOrUpdateAccountSchema',
    additionalProperties: false,
    required: ['accountId', 'name'],
    properties: {
        accountId: number1,
        name: {
            type: 'string',
            minLength: ACCOUNT_NAME_MIN,
            maxLength: ACCOUNT_NAME_MAX,
        },
        phone: nullablePhone,
        whatsapp: nullableWhatsapp,
        telegram: nullableTelegram,
    },
};

const getProfileSchema = {
    id: 'getProfileSchema',
    additionalProperties: false,
    required: ['accountId'],
    properties: {
        accountId: number1,
    },
};

module.exports = {
    registerSchema,
    signInSchema,
    telegramAuthSchema,
    getSessionSchema,
    signOutSchema,
    createOrUpdateAccountSchema,
    getProfileSchema,
};
