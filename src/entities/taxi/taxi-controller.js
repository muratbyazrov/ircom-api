const {Story} = require('story-system');
const {
    createTaxiOfferSchema,
    updateTaxiOfferSchema,
    deleteTaxiOfferSchema,
    getTaxiOffersSchema,
    getTaxiOfferByIdSchema,
    getMyTaxiOffersSchema,
    toggleTaxiFavoriteSchema,
} = require('./schemas.js');

class TaxiController {
    constructor(config, service) {
        this.service = service;
    }

    createTaxiOffer(data) {
        Story.validator.validate(data.params, createTaxiOfferSchema);
        return this.service.createTaxiOffer(data);
    }

    updateTaxiOffer(data) {
        Story.validator.validate(data.params, updateTaxiOfferSchema);
        return this.service.updateTaxiOffer(data);
    }

    deleteTaxiOffer(data) {
        Story.validator.validate(data.params, deleteTaxiOfferSchema);
        return this.service.deleteTaxiOffer(data);
    }

    getTaxiOffers(data) {
        Story.validator.validate(data.params, getTaxiOffersSchema);
        return this.service.getTaxiOffers(data);
    }

    getTaxiOfferById(data) {
        Story.validator.validate(data.params, getTaxiOfferByIdSchema);
        return this.service.getTaxiOfferById(data);
    }

    getMyTaxiOffers(data) {
        Story.validator.validate(data.params, getMyTaxiOffersSchema);
        return this.service.getMyTaxiOffers(data);
    }

    toggleTaxiFavorite(data) {
        Story.validator.validate(data.params, toggleTaxiFavoriteSchema);
        return this.service.toggleTaxiFavorite(data);
    }
}

module.exports = {TaxiController};
