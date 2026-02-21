const {Story: {validator: {schemaItems: {number1, string1}}}} = require('story-system');

const initPhotoUploadSchema = {
    id: 'initPhotoUploadSchema',
    additionalItems: false,
    required: ['accountId', 'entityType', 'mimeType', 'byteSize'],
    properties: {
        accountId: number1,
        entityType: {
            enum: ['listing', 'taxi', 'dish', 'restaurant'],
        },
        mimeType: {
            type: 'string',
            minLength: 3,
            maxLength: 100,
        },
        byteSize: {
            type: 'integer',
            minimum: 1,
            maximum: 20 * 1024 * 1024,
        },
        originalName: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
        },
    },
};

const buildPhotoUrlSchema = {
    id: 'buildPhotoUrlSchema',
    additionalItems: false,
    required: ['objectKey'],
    properties: {
        objectKey: string1,
    },
};

module.exports = {
    initPhotoUploadSchema,
    buildPhotoUrlSchema,
};
