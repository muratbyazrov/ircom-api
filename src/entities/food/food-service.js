const {Story} = require('story-system');
const {
    createRestaurant,
    updateRestaurant,
    getMyRestaurant,
    getRestaurants,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItems,
    getMenuItemById,
    toggleMenuItemFavorite,
} = require('./queries.js');

const normalizeOptionalText = value => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const resolveRestaurantLogoUrl = params => {
    const logoCandidates = [
        params.logoUrl,
        params.logo,
        params.photoUrl,
        params.photo,
    ];

    for (const candidate of logoCandidates) {
        const normalized = normalizeOptionalText(candidate);
        if (normalized) {
            return normalized;
        }
    }

    return null;
};

const normalizePhotos = params => {
    if (!Object.prototype.hasOwnProperty.call(params, 'photos') || params.photos === null) {
        return null;
    }

    return JSON.stringify(params.photos);
};

class FoodService {
    createOrUpdateRestaurant({params}) {
        const queryParams = {
            ...params,
            address: normalizeOptionalText(params.address),
            description: params.description || '',
            logoUrl: resolveRestaurantLogoUrl(params),
            phone: normalizeOptionalText(params.phone),
            whatsapp: normalizeOptionalText(params.whatsapp),
            telegram: normalizeOptionalText(params.telegram),
        };

        return Story.dbAdapter.execQuery({
            queryName: Number.isInteger(params.restaurantId) ? updateRestaurant : createRestaurant,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    getMyRestaurant({params = {}}) {
        if (!Number.isInteger(params.accountId) || params.accountId < 1) {
            return null;
        }

        return Story.dbAdapter.execQuery({
            queryName: getMyRestaurant,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getRestaurants({params = {}}) {
        const sortBy = params.sortBy || 'date_desc';
        const restParams = {...params};
        delete restParams.sortBy;
        const queryParams = {
            ...restParams,
            limit: params.limit || 20,
            offset: params.offset || 0,
            ...(sortBy === 'name_asc' ? {sortNameAsc: 1} : {sortDateDesc: 1}),
        };

        return Story.dbAdapter.execQuery({
            queryName: getRestaurants,
            params: queryParams,
        });
    }

    createMenuItem({params}) {
        const queryParams = {
            ...params,
            restaurantId: Number.isInteger(params.restaurantId) ? params.restaurantId : null,
            photos: normalizePhotos(params),
        };

        return Story.dbAdapter.execQuery({
            queryName: createMenuItem,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    updateMenuItem({params}) {
        const queryParams = {
            ...params,
            photos: normalizePhotos(params),
        };

        return Story.dbAdapter.execQuery({
            queryName: updateMenuItem,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    deleteMenuItem({params}) {
        return Story.dbAdapter.execQuery({
            queryName: deleteMenuItem,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getMenuItems({params = {}}) {
        const sortBy = params.sortBy || 'date_desc';
        const restParams = {...params};
        delete restParams.sortBy;
        const accountId = Number.isInteger(params.accountId) ? params.accountId : null;
        const queryParams = {
            ...restParams,
            accountId,
            limit: params.limit || 20,
            offset: params.offset || 0,
            ...(sortBy === 'price_asc' ? {sortPriceAsc: 1} : {}),
            ...(sortBy === 'price_desc' ? {sortPriceDesc: 1} : {}),
            ...(sortBy === 'cook_time_asc' ? {sortCookTimeAsc: 1} : {}),
            ...(!sortBy || sortBy === 'date_desc' ? {sortDateDesc: 1} : {}),
            ...(params.hasDelivery ? {hasDelivery: 1} : {}),
            ...(params.onlyAvailable ? {onlyAvailable: 1} : {}),
            ...(params.onlyFavorites ? {onlyFavorites: 1} : {}),
        };

        return Story.dbAdapter.execQuery({
            queryName: getMenuItems,
            params: queryParams,
        });
    }

    getMenuItemById({params}) {
        const queryParams = {
            ...params,
            accountId: Number.isInteger(params.accountId) ? params.accountId : null,
        };

        return Story.dbAdapter.execQuery({
            queryName: getMenuItemById,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    toggleMenuItemFavorite({params}) {
        return Story.dbAdapter.execQuery({
            queryName: toggleMenuItemFavorite,
            params,
            options: {
                singularRow: true,
            },
        });
    }
}

module.exports = {FoodService};
