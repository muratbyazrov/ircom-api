const {Story} = require('story-system');
const {emptySchema} = require('./schemas.js');

class DictionaryController {
    constructor(config, service) {
        this.service = service;
    }

    getListingCategories(data) {
        Story.validator.validate(data.params || {}, emptySchema);
        return this.service.getListingCategories();
    }

    getServiceCategories(data) {
        Story.validator.validate(data.params || {}, emptySchema);
        return this.service.getServiceCategories();
    }

    getKitchenCategories(data) {
        Story.validator.validate(data.params || {}, emptySchema);
        return this.service.getKitchenCategories();
    }

    getDictionaries(data) {
        Story.validator.validate(data.params || {}, emptySchema);
        return this.service.getDictionaries();
    }
}

module.exports = {DictionaryController};
