const {Story} = require('story-system');
const {
    createListingSchema,
    updateListingSchema,
    getListingsSchema,
    getListingByIdSchema,
    getMyListingsSchema,
    toggleListingFavoriteSchema,
} = require('./schemas.js');

class ListingController {
    constructor(config, service) {
        this.service = service;
    }

    createListing(data) {
        Story.validator.validate(data.params, createListingSchema);
        return this.service.createListing(data);
    }

    updateListing(data) {
        Story.validator.validate(data.params, updateListingSchema);
        return this.service.updateListing(data);
    }

    getListings(data) {
        Story.validator.validate(data.params, getListingsSchema);
        return this.service.getListings(data);
    }

    getListingById(data) {
        Story.validator.validate(data.params, getListingByIdSchema);
        return this.service.getListingById(data);
    }

    getMyListings(data) {
        Story.validator.validate(data.params, getMyListingsSchema);
        return this.service.getMyListings(data);
    }

    toggleListingFavorite(data) {
        Story.validator.validate(data.params, toggleListingFavoriteSchema);
        return this.service.toggleListingFavorite(data);
    }
}

module.exports = {ListingController};
