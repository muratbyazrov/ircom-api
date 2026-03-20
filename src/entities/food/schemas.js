const {Story: {validator: {schemaItems: {number1, string1, limit}}}} = require('story-system');

const FOOD_CONTACT_MAX = 20;
const FOOD_TELEGRAM_MAX = 64;
const FOOD_PRICE_MAX = 50000000;
const DELIVERY_PRICE_MAX = 1000000;
const RESTAURANT_NAME_MAX = 50;
const DISH_TITLE_MAX = 40;

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

const deliveryPriceValue = {
    anyOf: [
        {
            type: 'number',
            minimum: 0,
            maximum: DELIVERY_PRICE_MAX,
        },
        {
            type: 'string',
            pattern: '^(?:1000000(?:\\.0{1,2})?|(?:0|[1-9][0-9]{0,5})(?:\\.[0-9]{1,2})?)$',
        },
    ],
};

const foodContact = {
    type: 'string',
    minLength: 1,
    maxLength: FOOD_CONTACT_MAX,
};

const foodTelegram = {
    type: 'string',
    minLength: 1,
    maxLength: FOOD_TELEGRAM_MAX,
};

const restaurantPayloadProperties = {
    restaurantId: intLikeValue,
    accountId: number1,
    name: {
        type: 'string',
        minLength: 2,
        maxLength: RESTAURANT_NAME_MAX,
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
    phone: foodContact,
    whatsapp: foodContact,
    telegram: foodTelegram,
    hasDelivery: deliveryOptionValue,
    has_delivery: deliveryOptionValue,
    deliveryOption: deliveryOptionValue,
    deliveryType: deliveryOptionValue,
    delivery_type: deliveryOptionValue,
    delivery: deliveryOptionValue,
    deliveryMode: {enum: ['none', 'free', 'paid']},
    delivery_mode: {enum: ['none', 'free', 'paid']},
    deliveryPrice: deliveryPriceValue,
    delivery_price: deliveryPriceValue,
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
    anyOf: [
        {required: ['categoryId']},
        {required: ['category']},
    ],
    properties: {
        accountId: number1,
        restaurantId: number1,
        categoryId: number1,
        category: string1,
        name: {
            type: 'string',
            minLength: 2,
            maxLength: DISH_TITLE_MAX,
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        price: {
            type: 'number',
            minimum: 1,
            maximum: FOOD_PRICE_MAX,
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
    anyOf: [
        {required: ['categoryId']},
        {required: ['category']},
    ],
    properties: {
        accountId: number1,
        menuItemId: number1,
        categoryId: number1,
        category: string1,
        name: {
            type: 'string',
            minLength: 2,
            maxLength: DISH_TITLE_MAX,
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
        },
        price: {
            type: 'number',
            minimum: 1,
            maximum: FOOD_PRICE_MAX,
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
        categoryId: number1,
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
