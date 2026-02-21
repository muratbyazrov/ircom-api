const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const taxiPhoto = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};

const createTaxiOfferSchema = {
    id: 'createTaxiOfferSchema',
    additionalProperties: false,
    required: ['accountId', 'direction', 'displayName', 'phone', 'price'],
    properties: {
        accountId: number1,
        direction: {enum: [1, 2, 3]},
        displayName: {
            type: 'string',
            minLength: 2,
            maxLength: 60,
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        phone: string1,
        whatsapp: string1,
        telegram: string1,
        price: {
            type: 'number',
            minimum: 1,
        },
        departureAt: {
            type: 'string',
            minLength: 10,
            maxLength: 64,
        },
        seatsTotal: {
            type: 'integer',
            minimum: 1,
        },
        seatsFree: {
            type: 'integer',
            minimum: 0,
        },
        carPhotos: {
            type: 'array',
            maxItems: 10,
            items: taxiPhoto,
        },
    },
};

const updateTaxiOfferSchema = {
    id: 'updateTaxiOfferSchema',
    additionalProperties: false,
    required: ['accountId', 'taxiOfferId', 'direction', 'displayName', 'phone', 'price'],
    properties: {
        accountId: number1,
        taxiOfferId: number1,
        direction: {enum: [1, 2, 3]},
        displayName: {
            type: 'string',
            minLength: 2,
            maxLength: 60,
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        phone: string1,
        whatsapp: string1,
        telegram: string1,
        price: {
            type: 'number',
            minimum: 1,
        },
        departureAt: {
            type: 'string',
            minLength: 10,
            maxLength: 64,
        },
        seatsTotal: {
            type: 'integer',
            minimum: 1,
        },
        seatsFree: {
            type: 'integer',
            minimum: 0,
        },
        carPhotos: {
            type: 'array',
            maxItems: 10,
            items: taxiPhoto,
        },
    },
};

const deleteTaxiOfferSchema = {
    id: 'deleteTaxiOfferSchema',
    additionalProperties: false,
    required: ['accountId', 'taxiOfferId'],
    properties: {
        accountId: number1,
        taxiOfferId: number1,
    },
};

const getTaxiOffersSchema = {
    id: 'getTaxiOffersSchema',
    additionalProperties: false,
    required: ['direction'],
    properties: {
        direction: {enum: [1, 2, 3]},
        accountId: number1,
        onlyFavorites: {type: 'boolean'},
        sortBy: {enum: ['price_asc', 'price_desc', 'rating_desc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const getTaxiOfferByIdSchema = {
    id: 'getTaxiOfferByIdSchema',
    additionalProperties: false,
    required: ['taxiOfferId'],
    properties: {
        taxiOfferId: number1,
        accountId: number1,
    },
};

const getMyTaxiOffersSchema = {
    id: 'getMyTaxiOffersSchema',
    additionalProperties: false,
    required: ['accountId'],
    properties: {
        accountId: number1,
        direction: {enum: [1, 2, 3]},
        sortBy: {enum: ['price_asc', 'price_desc', 'rating_desc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const toggleTaxiFavoriteSchema = {
    id: 'toggleTaxiFavoriteSchema',
    additionalProperties: false,
    required: ['accountId', 'taxiOfferId'],
    properties: {
        accountId: number1,
        taxiOfferId: number1,
    },
};

module.exports = {
    createTaxiOfferSchema,
    updateTaxiOfferSchema,
    deleteTaxiOfferSchema,
    getTaxiOffersSchema,
    getTaxiOfferByIdSchema,
    getMyTaxiOffersSchema,
    toggleTaxiFavoriteSchema,
};
