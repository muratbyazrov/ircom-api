const {Story} = require('story-system');
const {
    createListingSchema,
    updateListingSchema,
    getListingsSchema,
    getListingByIdSchema,
    getMyListingsSchema,
    toggleListingFavoriteSchema,
    cleanupImportedListingsSchema,
    getImportedListingsForDedupSchema,
    deleteImportedListingByIdSchema,
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

    cleanupImportedListings(data) {
        Story.validator.validate(data.params, cleanupImportedListingsSchema);
        return this.service.cleanupImportedListings(data);
    }

    getImportedListingsForDedup(data) {
        Story.validator.validate(data.params, getImportedListingsForDedupSchema);
        return this.service.getImportedListingsForDedup(data);
    }

    deleteImportedListingById(data) {
        Story.validator.validate(data.params, deleteImportedListingByIdSchema);
        return this.service.deleteImportedListingById(data);
    }
}

module.exports = {ListingController};
