const {Story: {validator: {schemaItems: {number1, limit}}}} = require('story-system');

const TAXI_VEHICLE_MAX = 40;
const TAXI_CONTACT_MAX = 20;
const TAXI_TELEGRAM_MAX = 64;
const TAXI_PRICE_MAX = 50000000;
const TAXI_SEATS_MAX = 99;

const taxiPhoto = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};
const taxiRouteDirection = {enum: [1, 2]};
const taxiPlace = {
    type: 'string',
    minLength: 1,
    maxLength: 60,
};
const taxiRouteText = {
    type: 'string',
    minLength: 1,
    maxLength: 160,
};
const taxiVehicle = {
    type: 'string',
    minLength: 1,
    maxLength: TAXI_VEHICLE_MAX,
};
const taxiContact = {
    type: 'string',
    minLength: 1,
    maxLength: TAXI_CONTACT_MAX,
};
const taxiTelegram = {
    type: 'string',
    minLength: 1,
    maxLength: TAXI_TELEGRAM_MAX,
};
const taxiLegacyDisplayName = {
    type: 'string',
    minLength: 1,
    maxLength: 160,
};
const taxiDateTime = {
    type: 'string',
    minLength: 10,
    maxLength: 64,
};

const createTaxiOfferSchema = {
    id: 'createTaxiOfferSchema',
    additionalProperties: false,
    required: ['accountId', 'direction', 'phone', 'price'],
    properties: {
        accountId: number1,
        direction: {enum: [1, 2, 3]},
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        phone: taxiContact,
        whatsapp: taxiContact,
        telegram: taxiTelegram,
        // Legacy compatibility for cached clients; ignored by the service layer.
        displayName: taxiLegacyDisplayName,
        name: taxiLegacyDisplayName,
        price: {
            type: 'number',
            minimum: 1,
            maximum: TAXI_PRICE_MAX,
        },
        departureAt: taxiDateTime,
        routeDirection: taxiRouteDirection,
        fromPlace: taxiPlace,
        toPlace: taxiPlace,
        routeText: taxiRouteText,
        vehicle: taxiVehicle,
        seatsTotal: {
            type: 'integer',
            minimum: 1,
            maximum: TAXI_SEATS_MAX,
        },
        seatsFree: {
            type: 'integer',
            minimum: 0,
            maximum: TAXI_SEATS_MAX,
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
    required: ['accountId', 'taxiOfferId', 'direction', 'phone', 'price'],
    properties: {
        accountId: number1,
        taxiOfferId: number1,
        direction: {enum: [1, 2, 3]},
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        phone: taxiContact,
        whatsapp: taxiContact,
        telegram: taxiTelegram,
        // Legacy compatibility for cached clients; ignored by the service layer.
        displayName: taxiLegacyDisplayName,
        name: taxiLegacyDisplayName,
        price: {
            type: 'number',
            minimum: 1,
            maximum: TAXI_PRICE_MAX,
        },
        departureAt: taxiDateTime,
        routeDirection: taxiRouteDirection,
        fromPlace: taxiPlace,
        toPlace: taxiPlace,
        routeText: taxiRouteText,
        vehicle: taxiVehicle,
        seatsTotal: {
            type: 'integer',
            minimum: 1,
            maximum: TAXI_SEATS_MAX,
        },
        seatsFree: {
            type: 'integer',
            minimum: 0,
            maximum: TAXI_SEATS_MAX,
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
        routeDirection: taxiRouteDirection,
        departureFrom: taxiDateTime,
        onlyFavorites: {type: 'boolean'},
        sortBy: {enum: ['price_asc', 'price_desc', 'rating_desc', 'date_desc', 'departure_asc']},
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
        routeDirection: taxiRouteDirection,
        sortBy: {enum: ['price_asc', 'price_desc', 'rating_desc', 'date_desc', 'departure_asc']},
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
