const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const LISTING_CATEGORY_MAX = 80;
const LISTING_TITLE_MAX = 50;
const LISTING_PHONE_MAX = 20;
const LISTING_TELEGRAM_MAX = 64;
const LISTING_PRICE_MAX = 50000000;

const nullablePhone = {
    anyOf: [
        {type: 'null'},
        {
            type: 'string',
            minLength: 1,
            maxLength: LISTING_PHONE_MAX,
        },
    ],
};

const nullableTelegram = {
    anyOf: [
        {type: 'null'},
        {
            type: 'string',
            minLength: 1,
            maxLength: LISTING_TELEGRAM_MAX,
        },
    ],
};

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
        category: {
            type: 'string',
            minLength: 1,
            maxLength: LISTING_CATEGORY_MAX,
        },
        title: {
            type: 'string',
            minLength: 3,
            maxLength: LISTING_TITLE_MAX,
        },
        description: {
            type: 'string',
            minLength: 10,
            maxLength: 2000,
        },
        price: {
            type: 'number',
            minimum: 1,
            maximum: LISTING_PRICE_MAX,
        },
        phone: nullablePhone,
        telegram: nullableTelegram,
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
        category: {
            type: 'string',
            minLength: 1,
            maxLength: LISTING_CATEGORY_MAX,
        },
        title: {
            type: 'string',
            minLength: 3,
            maxLength: LISTING_TITLE_MAX,
        },
        description: {
            type: 'string',
            minLength: 10,
            maxLength: 2000,
        },
        price: {
            type: 'number',
            minimum: 1,
            maximum: LISTING_PRICE_MAX,
        },
        phone: nullablePhone,
        telegram: nullableTelegram,
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

const getImportedListingsForDedupSchema = {
    id: 'getImportedListingsForDedupSchema',
    additionalProperties: false,
    required: ['accountId', 'kind'],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const deleteImportedListingByIdSchema = {
    id: 'deleteImportedListingByIdSchema',
    additionalProperties: false,
    required: ['accountId', 'kind', 'listingId'],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
        listingId: number1,
    },
};

const deleteMyListingSchema = {
    id: 'deleteMyListingSchema',
    additionalProperties: false,
    required: ['accountId', 'kind', 'listingId'],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
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
    getImportedListingsForDedupSchema,
    deleteImportedListingByIdSchema,
    deleteMyListingSchema,
};
