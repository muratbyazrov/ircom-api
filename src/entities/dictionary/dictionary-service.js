const {Story} = require('story-system');
const {
    getListingCategories,
    getServiceCategories,
    getKitchenCategories,
} = require('./queries.js');

class DictionaryService {
    getListingCategories() {
        return Story.dbAdapter.execQuery({
            queryName: getListingCategories,
            params: {},
        });
    }

    getServiceCategories() {
        return Story.dbAdapter.execQuery({
            queryName: getServiceCategories,
            params: {},
        });
    }

    getKitchenCategories() {
        return Story.dbAdapter.execQuery({
            queryName: getKitchenCategories,
            params: {},
        });
    }

    async getDictionaries() {
        const [listingCategories, serviceCategories, kitchenCategories] = await Promise.all([
            this.getListingCategories(),
            this.getServiceCategories(),
            this.getKitchenCategories(),
        ]);

        return {
            listingCategories,
            serviceCategories,
            kitchenCategories,
        };
    }
}

module.exports = {DictionaryService};
