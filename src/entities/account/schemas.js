const {Story: {validator: {schemaItems: {number1, string1, nullOrString}}}} = require('story-system');

const registerSchema = {
    id: 'registerSchema',
    additionalProperties: false,
    required: ['name', 'phone', 'password'],
    properties: {
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 80,
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
    additionalProperties: false,
    required: ['phone', 'password'],
    properties: {
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
        name: string1,
        phone: nullOrString,
        whatsapp: nullOrString,
        telegram: nullOrString,
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
    getSessionSchema,
    signOutSchema,
    createOrUpdateAccountSchema,
    getProfileSchema,
};
