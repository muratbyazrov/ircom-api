const {Story} = require('story-system');
const {
    createListing,
    updateListing,
    getListings,
    getListingById,
    getMyListings,
    toggleListingFavorite,
} = require('./queries.js');

const normalizePhotos = params => {
    if (!Object.prototype.hasOwnProperty.call(params, 'photos') || params.photos === null) {
        return null;
    }

    return JSON.stringify(params.photos);
};

const normalizeOptionalInt = value => {
    if (Number.isInteger(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number.parseInt(value, 10);
        return Number.isInteger(parsed) ? parsed : null;
    }

    return null;
};

class ListingService {
    createListing({params}) {
        const categoryId = normalizeOptionalInt(params.categoryId);
        const queryParams = {
            ...params,
            categoryId,
            realEstateType: Object.prototype.hasOwnProperty.call(params, 'realEstateType') ? params.realEstateType : null,
            photos: normalizePhotos(params),
        };

        return Story.dbAdapter.execQuery({
            queryName: createListing,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    updateListing({params}) {
        const categoryId = normalizeOptionalInt(params.categoryId);
        const queryParams = {
            ...params,
            categoryId,
            realEstateType: Object.prototype.hasOwnProperty.call(params, 'realEstateType') ? params.realEstateType : null,
            photos: normalizePhotos(params),
        };

        return Story.dbAdapter.execQuery({
            queryName: updateListing,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    getListings({params = {}}) {
        const accountId = Number.isInteger(params.accountId) ? params.accountId : null;
        const categoryId = normalizeOptionalInt(params.categoryId);
        const restParams = {...params};
        delete restParams.categoryId;
        const queryParams = {
            ...restParams,
            accountId,
            ...(categoryId === null ? {} : {categoryId}),
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
            ...(params.onlyFavorites ? {onlyFavorites: 1} : {}),
        };

        return Story.dbAdapter.execQuery({
            queryName: getListings,
            params: queryParams,
        });
    }

    getListingById({params}) {
        const queryParams = {
            ...params,
            accountId: Number.isInteger(params.accountId) ? params.accountId : null,
        };

        return Story.dbAdapter.execQuery({
            queryName: getListingById,
            params: queryParams,
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
