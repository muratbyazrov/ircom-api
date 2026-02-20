const {Story: {validator: {schemaItems: {number1, string1, nullOrString}}}} = require('story-system');

const registerSchema = {
    id: 'registerSchema',
    additionalItems: false,
    required: ['name', 'password'],
    anyOf: [
        {required: ['phone']},
        {required: ['nickname']},
    ],
    properties: {
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 80,
        },
        nickname: {
            type: 'string',
            minLength: 3,
            maxLength: 40,
        },
        phone: {
            type: 'string',
            minLength: 6,
            maxLength: 20,
        },
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 128,
        },
        whatsapp: nullOrString,
        telegram: nullOrString,
    },
};

const signInSchema = {
    id: 'signInSchema',
    additionalItems: false,
    required: ['login', 'password'],
    properties: {
        login: string1,
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 128,
        },
    },
};

const getSessionSchema = {
    id: 'getSessionSchema',
    additionalItems: false,
    required: ['sessionToken'],
    properties: {
        sessionToken: string1,
    },
};

const signOutSchema = {
    id: 'signOutSchema',
    additionalItems: false,
    required: ['sessionToken'],
    properties: {
        sessionToken: string1,
    },
};

const createOrUpdateAccountSchema = {
    id: 'createOrUpdateAccountSchema',
    additionalItems: false,
    required: ['accountId', 'name'],
    properties: {
        accountId: number1,
        name: string1,
        nickname: nullOrString,
        phone: nullOrString,
        whatsapp: nullOrString,
        telegram: nullOrString,
    },
};

const getProfileSchema = {
    id: 'getProfileSchema',
    additionalItems: false,
    required: ['accountId'],
    properties: {
        accountId: number1,
    },
};

module.exports = {
    registerSchema,
    signInSchema,
    getSessionSchema,
    signOutSchema,
    createOrUpdateAccountSchema,
    getProfileSchema,
};
