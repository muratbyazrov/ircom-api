const {Story} = require('story-system');
const {
    createOrUpdateRestaurantSchema,
    getMyRestaurantSchema,
    createMenuItemSchema,
    updateMenuItemSchema,
    deleteMenuItemSchema,
    getMenuItemsSchema,
    getMenuItemByIdSchema,
    toggleMenuItemFavoriteSchema,
} = require('./schemas.js');

class FoodController {
    constructor(config, service) {
        this.service = service;
    }

    createOrUpdateRestaurant(data) {
        Story.validator.validate(data.params, createOrUpdateRestaurantSchema);
        return this.service.createOrUpdateRestaurant(data);
    }

    getMyRestaurant(data) {
        Story.validator.validate(data.params, getMyRestaurantSchema);
        return this.service.getMyRestaurant(data);
    }

    createMenuItem(data) {
        Story.validator.validate(data.params, createMenuItemSchema);
        return this.service.createMenuItem(data);
    }

    updateMenuItem(data) {
        Story.validator.validate(data.params, updateMenuItemSchema);
        return this.service.updateMenuItem(data);
    }

    deleteMenuItem(data) {
        Story.validator.validate(data.params, deleteMenuItemSchema);
        return this.service.deleteMenuItem(data);
    }

    getMenuItems(data) {
        Story.validator.validate(data.params, getMenuItemsSchema);
        return this.service.getMenuItems(data);
    }

    getMenuItemById(data) {
        Story.validator.validate(data.params, getMenuItemByIdSchema);
        return this.service.getMenuItemById(data);
    }

    toggleMenuItemFavorite(data) {
        Story.validator.validate(data.params, toggleMenuItemFavoriteSchema);
        return this.service.toggleMenuItemFavorite(data);
    }
}

module.exports = {FoodController};
