const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const listingPhoto = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};

const importedPhotoObjectKey = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};

const importMetaSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['source', 'msgId', 'date'],
    properties: {
        source: string1,
        msgId: number1,
        date: {
            type: 'string',
            minLength: 10,
            maxLength: 64,
        },
        permalink: string1,
        contentHash: string1,
        photoObjectKeys: {
            type: 'array',
            maxItems: 10,
            items: importedPhotoObjectKey,
        },
    },
};

const createListingSchema = {
    id: 'createListingSchema',
    additionalProperties: false,
    required: ['accountId', 'kind', 'title', 'description', 'price'],
    anyOf: [
        {required: ['categoryId']},
        {required: ['category']},
    ],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
        categoryId: number1,
        category: string1,
        title: {
            type: 'string',
            minLength: 3,
            maxLength: 80,
        },
        description: {
            type: 'string',
            minLength: 10,
            maxLength: 2000,
        },
        price: {
            type: 'number',
            minimum: 1,
        },
        phone: string1,
        telegram: string1,
        realEstateType: {enum: [1, 2]},
        photos: {
            type: 'array',
            maxItems: 10,
            items: listingPhoto,
        },
        importMeta: importMetaSchema,
    },
};

const updateListingSchema = {
    id: 'updateListingSchema',
    additionalProperties: false,
    required: ['accountId', 'listingId', 'kind', 'title', 'description', 'price'],
    anyOf: [
        {required: ['categoryId']},
        {required: ['category']},
    ],
    properties: {
        accountId: number1,
        listingId: number1,
        kind: {enum: [1, 2]},
        categoryId: number1,
        category: string1,
        title: {
            type: 'string',
            minLength: 3,
            maxLength: 80,
        },
        description: {
            type: 'string',
            minLength: 10,
            maxLength: 2000,
        },
        price: {
            type: 'number',
            minimum: 1,
        },
        phone: string1,
        telegram: string1,
        realEstateType: {enum: [1, 2]},
        photos: {
            type: 'array',
            maxItems: 10,
            items: listingPhoto,
        },
    },
};

const cleanupImportedListingsSchema = {
    id: 'cleanupImportedListingsSchema',
    additionalProperties: false,
    required: ['accountId', 'kind', 'olderThan'],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
        olderThan: {
            type: 'string',
            minLength: 10,
            maxLength: 64,
        },
    },
};

const getListingsSchema = {
    id: 'getListingsSchema',
    additionalProperties: false,
    required: ['kind'],
    properties: {
        kind: {enum: [1, 2]},
        categoryId: number1,
        category: string1,
        accountId: number1,
        onlyFavorites: {type: 'boolean'},
        sortBy: {enum: ['price_asc', 'price_desc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const getListingByIdSchema = {
    id: 'getListingByIdSchema',
    additionalProperties: false,
    required: ['listingId'],
    properties: {
        listingId: number1,
        accountId: number1,
    },
};

const getMyListingsSchema = {
    id: 'getMyListingsSchema',
    additionalProperties: false,
    required: ['accountId', 'kind'],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
        sortBy: {enum: ['price_asc', 'price_desc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const toggleListingFavoriteSchema = {
    id: 'toggleListingFavoriteSchema',
    additionalProperties: false,
    required: ['accountId', 'listingId'],
    properties: {
        accountId: number1,
        listingId: number1,
    },
};

module.exports = {
    createListingSchema,
    updateListingSchema,
    getListingsSchema,
    getListingByIdSchema,
    getMyListingsSchema,
    toggleListingFavoriteSchema,
    cleanupImportedListingsSchema,
};
