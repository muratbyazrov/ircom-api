const {Story} = require('story-system');
const {
    createListing,
    updateListing,
    getListings,
    getListingById,
    getMyListings,
    toggleListingFavorite,
} = require('./queries.js');

class ListingService {
    createListing({params}) {
        return Story.dbAdapter.execQuery({
            queryName: createListing,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    updateListing({params}) {
        return Story.dbAdapter.execQuery({
            queryName: updateListing,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getListings({params = {}}) {
        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
            onlyFavorites: params.onlyFavorites ? 1 : undefined,
        };

        return Story.dbAdapter.execQuery({
            queryName: getListings,
            params: queryParams,
        });
    }

    getListingById({params}) {
        return Story.dbAdapter.execQuery({
            queryName: getListingById,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getMyListings({params = {}}) {
        if (!Number.isInteger(params.accountId) || params.accountId < 1) {
            return [];
        }

        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
        };

        return Story.dbAdapter.execQuery({
            queryName: getMyListings,
            params: queryParams,
        });
    }

    toggleListingFavorite({params}) {
        return Story.dbAdapter.execQuery({
            queryName: toggleListingFavorite,
            params,
            options: {
                singularRow: true,
            },
        });
    }
}

module.exports = {ListingService};
