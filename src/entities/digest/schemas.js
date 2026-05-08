const emptySchema = {
    type: 'object',
    properties: {},
    additionalProperties: false,
};

const markDigestSentSchema = {
    type: 'object',
    required: ['telegramUserId'],
    properties: {
        telegramUserId: {type: 'number'},
    },
    additionalProperties: false,
};

const getDigestSettingsSchema = {
    type: 'object',
    required: ['telegramUserId'],
    properties: {
        telegramUserId: {type: 'number'},
    },
    additionalProperties: false,
};

const setDigestFrequencySchema = {
    type: 'object',
    required: ['telegramUserId', 'frequency'],
    properties: {
        telegramUserId: {type: 'number'},
        frequency:      {type: 'string', enum: ['daily', 'every3days', 'only10plus', 'disabled']},
    },
    additionalProperties: false,
};

module.exports = {emptySchema, markDigestSentSchema, setDigestFrequencySchema, getDigestSettingsSchema};
