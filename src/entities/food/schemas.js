const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const photoItem = {
    type: 'string',
    minLength: 1,
    maxLength: 2048,
};

const createOrUpdateRestaurantSchema = {
    id: 'createOrUpdateRestaurantSchema',
    additionalItems: false,
    required: ['accountId', 'name'],
    properties: {
        accountId: number1,
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
        logoUrl: string1,
        phone: string1,
        whatsapp: string1,
        telegram: string1,
    },
};

const getMyRestaurantSchema = {
    id: 'getMyRestaurantSchema',
    additionalItems: false,
    required: ['accountId'],
    properties: {
        accountId: number1,
    },
};

const createMenuItemSchema = {
    id: 'createMenuItemSchema',
    additionalItems: false,
    required: ['accountId', 'name', 'price'],
    properties: {
        accountId: number1,
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
        cookTimeMinutes: {
            type: 'integer',
            minimum: 1,
        },
        alwaysInStock: {type: 'boolean'},
        price: {
            type: 'number',
            minimum: 1,
        },
        hasDelivery: {type: 'boolean'},
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
    additionalItems: false,
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
        cookTimeMinutes: {
            type: 'integer',
            minimum: 1,
        },
        alwaysInStock: {type: 'boolean'},
        price: {
            type: 'number',
            minimum: 1,
        },
        hasDelivery: {type: 'boolean'},
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
    additionalItems: false,
    required: ['accountId', 'menuItemId'],
    properties: {
        accountId: number1,
        menuItemId: number1,
    },
};

const getMenuItemsSchema = {
    id: 'getMenuItemsSchema',
    additionalItems: false,
    required: ['limit'],
    properties: {
        accountId: number1,
        restaurantId: number1,
        category: string1,
        hasDelivery: {type: 'boolean'},
        onlyAvailable: {type: 'boolean'},
        onlyFavorites: {type: 'boolean'},
        sortBy: {enum: ['price_asc', 'price_desc', 'cook_time_asc', 'date_desc']},
        limit,
        offset: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const getMenuItemByIdSchema = {
    id: 'getMenuItemByIdSchema',
    additionalItems: false,
    required: ['menuItemId'],
    properties: {
        menuItemId: number1,
        accountId: number1,
    },
};

const toggleMenuItemFavoriteSchema = {
    id: 'toggleMenuItemFavoriteSchema',
    additionalItems: false,
    required: ['accountId', 'menuItemId'],
    properties: {
        accountId: number1,
        menuItemId: number1,
    },
};

module.exports = {
    createOrUpdateRestaurantSchema,
    getMyRestaurantSchema,
    createMenuItemSchema,
    updateMenuItemSchema,
    deleteMenuItemSchema,
    getMenuItemsSchema,
    getMenuItemByIdSchema,
    toggleMenuItemFavoriteSchema,
};
