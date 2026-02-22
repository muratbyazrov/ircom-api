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

const normalizeOptionalNumber = value => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
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

const normalizeDeliveryValue = value => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        if (value === 1) return true;
        if (value === 0) return false;
        return null;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (!normalized) return null;

        const truthy = new Set([
            '1',
            'true',
            'yes',
            'on',
            'free',
            'paid',
            'delivery',
            'with_delivery',
            'has_delivery',
            'бесплатно',
            'платно',
            'есть доставка',
        ]);
        const falsy = new Set([
            '0',
            'false',
            'no',
            'off',
            'none',
            'without_delivery',
            'no_delivery',
            'нет',
            'нет доставки',
        ]);

        if (truthy.has(normalized)) return true;
        if (falsy.has(normalized)) return false;

        if (
            normalized.includes('free') ||
            normalized.includes('paid') ||
            normalized.includes('deliver') ||
            normalized.includes('бесплат') ||
            normalized.includes('достав')
        ) {
            return !(
                normalized.includes('none') ||
                normalized.includes('no_') ||
                normalized.includes('without') ||
                normalized.includes('без') ||
                normalized.includes('нет')
            );
        }
    }

    if (value && typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'value')) {
            return normalizeDeliveryValue(value.value);
        }
        if (Object.prototype.hasOwnProperty.call(value, 'type')) {
            return normalizeDeliveryValue(value.type);
        }
        if (Object.prototype.hasOwnProperty.call(value, 'option')) {
            return normalizeDeliveryValue(value.option);
        }
        if (Object.prototype.hasOwnProperty.call(value, 'code')) {
            return normalizeDeliveryValue(value.code);
        }
    }

    return null;
};

const normalizeDeliveryMode = value => {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === 'boolean') {
        return value ? 'free' : 'none';
    }

    if (typeof value === 'number') {
        if (value === 1) return 'free';
        if (value === 0) return 'none';
        return null;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (!normalized) return null;

        if (['none', 'no', 'нет', 'нет доставки', 'without_delivery', 'no_delivery'].includes(normalized)) {
            return 'none';
        }

        if (['paid', 'платно'].includes(normalized)) {
            return 'paid';
        }

        if (['free', 'бесплатно', 'yes', 'true', 'есть доставка', 'delivery', 'with_delivery', 'has_delivery'].includes(normalized)) {
            return 'free';
        }
    }

    if (value && typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'mode')) {
            return normalizeDeliveryMode(value.mode);
        }
        if (Object.prototype.hasOwnProperty.call(value, 'type')) {
            return normalizeDeliveryMode(value.type);
        }
        if (Object.prototype.hasOwnProperty.call(value, 'value')) {
            return normalizeDeliveryMode(value.value);
        }
    }

    return null;
};

const pickFirstDefined = (params, keys) => {
    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            return params[key];
        }
    }

    return null;
};

const resolveRawHasDelivery = params => {
    const primaryValue = pickFirstDefined(params, [
        'hasDelivery',
        'has_delivery',
        'deliveryOption',
        'deliveryType',
        'delivery_type',
        'delivery',
    ]);
    if (primaryValue !== null) {
        return primaryValue;
    }

    if (params.deliveryOptions && typeof params.deliveryOptions === 'object') {
        return pickFirstDefined(params.deliveryOptions, ['value', 'type', 'option', 'code', 'delivery']);
    }

    return null;
};

const resolveRawDeliveryMode = params => {
    const primaryValue = pickFirstDefined(params, [
        'deliveryMode',
        'delivery_mode',
        'deliveryOption',
        'deliveryType',
        'delivery_type',
        'delivery',
    ]);
    if (primaryValue !== null) {
        return primaryValue;
    }

    if (params.deliveryOptions && typeof params.deliveryOptions === 'object') {
        return pickFirstDefined(params.deliveryOptions, ['mode', 'type', 'option', 'value', 'delivery']);
    }

    return null;
};

class FoodService {
    createOrUpdateRestaurant({params}) {
        const restaurantId = normalizeOptionalInt(params.restaurantId);
        const rawDeliveryMode = resolveRawDeliveryMode(params);
        const rawHasDelivery = resolveRawHasDelivery(params);
        const deliveryMode = normalizeDeliveryMode(rawDeliveryMode);
        const hasDelivery = normalizeDeliveryValue(rawHasDelivery);
        const resolvedDeliveryMode = deliveryMode !== null
            ? deliveryMode
            : (hasDelivery === null ? null : (hasDelivery ? 'free' : 'none'));
        const resolvedHasDelivery = resolvedDeliveryMode !== null
            ? resolvedDeliveryMode !== 'none'
            : hasDelivery;
        const inputDeliveryPrice = normalizeOptionalNumber(
            pickFirstDefined(params, ['deliveryPrice', 'delivery_price'])
        );
        const deliveryPrice = resolvedDeliveryMode === 'paid'
            ? (inputDeliveryPrice === null ? 0 : Math.max(0, inputDeliveryPrice))
            : (resolvedDeliveryMode === null ? null : 0);

        const queryParams = {
            ...params,
            restaurantId,
            address: normalizeOptionalText(params.address),
            description: params.description || '',
            logoUrl: resolveRestaurantLogoUrl(params),
            phone: normalizeOptionalText(params.phone),
            whatsapp: normalizeOptionalText(params.whatsapp),
            telegram: normalizeOptionalText(params.telegram),
            hasDelivery: resolvedHasDelivery,
            deliveryMode: resolvedDeliveryMode,
            deliveryPrice,
        };

        return Story.dbAdapter.execQuery({
            queryName: Number.isInteger(restaurantId) ? updateRestaurant : createRestaurant,
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
            ...(!sortBy || sortBy === 'date_desc' ? {sortDateDesc: 1} : {}),
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
