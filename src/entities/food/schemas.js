const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const photoItem = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};

const deliveryOptionValue = {
    anyOf: [
        {type: 'boolean'},
        {type: 'string', minLength: 1, maxLength: 50},
        {type: 'integer'},
    ],
};

const intLikeValue = {
    anyOf: [
        number1,
        {
            type: 'string',
            pattern: '^[1-9][0-9]*$',
        },
    ],
};

const nonNegativeNumberLikeValue = {
    anyOf: [
        {
            type: 'number',
            minimum: 0,
        },
        {
            type: 'string',
            pattern: '^[0-9]+(?:\\.[0-9]+)?$',
        },
    ],
};

const restaurantPayloadProperties = {
    restaurantId: intLikeValue,
    accountId: number1,
    name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
    },
    address: {
        type: 'string',
        minLength: 2,
        maxLength: 200,
    },
    description: {
        type: 'string',
        minLength: 0,
        maxLength: 2000,
    },
    logoUrl: string1,
    photoUrl: string1,
    logo: string1,
    photo: string1,
    phone: string1,
    whatsapp: string1,
    telegram: string1,
    hasDelivery: deliveryOptionValue,
    has_delivery: deliveryOptionValue,
    deliveryOption: deliveryOptionValue,
    deliveryType: deliveryOptionValue,
    delivery_type: deliveryOptionValue,
    delivery: deliveryOptionValue,
    deliveryMode: {enum: ['none', 'free', 'paid']},
    delivery_mode: {enum: ['none', 'free', 'paid']},
    deliveryPrice: nonNegativeNumberLikeValue,
    delivery_price: nonNegativeNumberLikeValue,
};

const createRestaurantSchema = {
    id: 'createRestaurantSchema',
    additionalProperties: false,
    required: ['accountId', 'name'],
    properties: restaurantPayloadProperties,
};

const updateRestaurantSchema = {
    id: 'updateRestaurantSchema',
    additionalProperties: false,
    required: ['accountId', 'restaurantId'],
    properties: restaurantPayloadProperties,
};

const getMyRestaurantSchema = {
    id: 'getMyRestaurantSchema',
    additionalProperties: false,
    required: ['accountId'],
    properties: {
        accountId: number1,
    },
};

const getRestaurantsSchema = {
    id: 'getRestaurantsSchema',
    additionalProperties: false,
    properties: {
        sortBy: {enum: ['name_asc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const createMenuItemSchema = {
    id: 'createMenuItemSchema',
    additionalProperties: false,
    required: ['accountId', 'name', 'price'],
    properties: {
        accountId: number1,
        restaurantId: number1,
        category: string1,
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        alwaysInStock: {type: 'boolean'},
        price: {
            type: 'number',
            minimum: 1,
        },
        isAvailable: {type: 'boolean'},
        photos: {
            type: 'array',
            maxItems: 10,
            items: photoItem,
        },
    },
};

const updateMenuItemSchema = {
    id: 'updateMenuItemSchema',
    additionalProperties: false,
    required: ['accountId', 'menuItemId', 'name', 'price'],
    properties: {
        accountId: number1,
        menuItemId: number1,
        category: string1,
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        alwaysInStock: {type: 'boolean'},
        price: {
            type: 'number',
            minimum: 1,
        },
        isAvailable: {type: 'boolean'},
        photos: {
            type: 'array',
            maxItems: 10,
            items: photoItem,
        },
    },
};

const deleteMenuItemSchema = {
    id: 'deleteMenuItemSchema',
    additionalProperties: false,
    required: ['accountId', 'menuItemId'],
    properties: {
        accountId: number1,
        menuItemId: number1,
    },
};

const getMenuItemsSchema = {
    id: 'getMenuItemsSchema',
    additionalProperties: false,
    properties: {
        accountId: number1,
        restaurantId: number1,
        category: string1,
        onlyAvailable: {type: 'boolean'},
        onlyFavorites: {type: 'boolean'},
        sortBy: {enum: ['price_asc', 'price_desc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const getMenuItemByIdSchema = {
    id: 'getMenuItemByIdSchema',
    additionalProperties: false,
    required: ['menuItemId'],
    properties: {
        menuItemId: number1,
        accountId: number1,
    },
};

const toggleMenuItemFavoriteSchema = {
    id: 'toggleMenuItemFavoriteSchema',
    additionalProperties: false,
    required: ['accountId', 'menuItemId'],
    properties: {
        accountId: number1,
        menuItemId: number1,
    },
};

module.exports = {
    createRestaurantSchema,
    updateRestaurantSchema,
    getMyRestaurantSchema,
    getRestaurantsSchema,
    createMenuItemSchema,
    updateMenuItemSchema,
    deleteMenuItemSchema,
    getMenuItemsSchema,
    getMenuItemByIdSchema,
    toggleMenuItemFavoriteSchema,
};
