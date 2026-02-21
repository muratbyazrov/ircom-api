const {Story} = require('story-system');
const {
    createTaxiOffer,
    updateTaxiOffer,
    getTaxiOffers,
    getTaxiOfferById,
    getMyTaxiOffers,
    toggleTaxiFavorite,
} = require('./queries.js');

class TaxiService {
    createTaxiOffer({params}) {
        return Story.dbAdapter.execQuery({
            queryName: createTaxiOffer,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    updateTaxiOffer({params}) {
        return Story.dbAdapter.execQuery({
            queryName: updateTaxiOffer,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getTaxiOffers({params}) {
        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
            onlyFavorites: params.onlyFavorites ? 1 : undefined,
        };

        return Story.dbAdapter.execQuery({
            queryName: getTaxiOffers,
            params: queryParams,
        });
    }

    getTaxiOfferById({params}) {
        return Story.dbAdapter.execQuery({
            queryName: getTaxiOfferById,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getMyTaxiOffers({params}) {
        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
        };

        return Story.dbAdapter.execQuery({
            queryName: getMyTaxiOffers,
            params: queryParams,
        });
    }

    toggleTaxiFavorite({params}) {
        return Story.dbAdapter.execQuery({
            queryName: toggleTaxiFavorite,
            params,
            options: {
                singularRow: true,
            },
        });
    }
}

module.exports = {TaxiService};
