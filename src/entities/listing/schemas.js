const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const listingPhoto = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};

const createListingSchema = {
    id: 'createListingSchema',
    additionalItems: false,
    required: ['accountId', 'kind', 'category', 'title', 'description', 'price'],
    properties: {
        accountId: number1,
        kind: {enum: [1, 2]},
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
        realEstateType: {enum: [1, 2]},
        photos: {
            type: 'array',
            maxItems: 10,
            items: listingPhoto,
        },
    },
};

const getListingsSchema = {
    id: 'getListingsSchema',
    additionalItems: false,
    required: ['kind', 'limit'],
    properties: {
        kind: {enum: [1, 2]},
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
    additionalItems: false,
    required: ['listingId'],
    properties: {
        listingId: number1,
        accountId: number1,
    },
};

const getMyListingsSchema = {
    id: 'getMyListingsSchema',
    additionalItems: false,
    required: ['accountId', 'kind', 'limit'],
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
    additionalItems: false,
    required: ['accountId', 'listingId'],
    properties: {
        accountId: number1,
        listingId: number1,
    },
};

module.exports = {
    createListingSchema,
    getListingsSchema,
    getListingByIdSchema,
    getMyListingsSchema,
    toggleListingFavoriteSchema,
};
