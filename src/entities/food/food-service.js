const {Story} = require('story-system');
const {
    createOrUpdateRestaurant,
    getMyRestaurant,
    getRestaurants,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItems,
    getMenuItemById,
    toggleMenuItemFavorite,
} = require('./queries.js');

class FoodService {
    createOrUpdateRestaurant({params}) {
        return Story.dbAdapter.execQuery({
            queryName: createOrUpdateRestaurant,
            params,
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
        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
        };

        return Story.dbAdapter.execQuery({
            queryName: getRestaurants,
            params: queryParams,
        });
    }

    createMenuItem({params}) {
        return Story.dbAdapter.execQuery({
            queryName: createMenuItem,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    updateMenuItem({params}) {
        return Story.dbAdapter.execQuery({
            queryName: updateMenuItem,
            params,
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
        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
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
        return Story.dbAdapter.execQuery({
            queryName: getMenuItemById,
            params,
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
