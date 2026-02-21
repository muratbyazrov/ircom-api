const {Story} = require('story-system');
const {
    createTaxiOffer,
    updateTaxiOffer,
    getTaxiOffers,
    getTaxiOfferById,
    getMyTaxiOffers,
    toggleTaxiFavorite,
} = require('./queries.js');

const normalizeOptionalText = value => {
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

const normalizeOptionalInt = value => {
    return Number.isInteger(value) ? value : null;
};

const normalizeCarPhotos = params => {
    if (!Object.prototype.hasOwnProperty.call(params, 'carPhotos') || params.carPhotos === null) {
        return null;
    }
    return JSON.stringify(params.carPhotos);
};

const normalizeTaxiParams = params => ({
    ...params,
    description: typeof params.description === 'string' ? params.description : '',
    whatsapp: normalizeOptionalText(params.whatsapp),
    telegram: normalizeOptionalText(params.telegram),
    departureAt: normalizeOptionalText(params.departureAt),
    seatsTotal: normalizeOptionalInt(params.seatsTotal),
    seatsFree: normalizeOptionalInt(params.seatsFree),
    carPhotos: normalizeCarPhotos(params),
});

class TaxiService {
    createTaxiOffer({params}) {
        const queryParams = normalizeTaxiParams(params);

        return Story.dbAdapter.execQuery({
            queryName: createTaxiOffer,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    updateTaxiOffer({params}) {
        const queryParams = normalizeTaxiParams(params);

        return Story.dbAdapter.execQuery({
            queryName: updateTaxiOffer,
            params: queryParams,
            options: {
                singularRow: true,
            },
        });
    }

    getTaxiOffers({params = {}}) {
        const queryParams = {
            ...params,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
            ...(params.onlyFavorites ? {onlyFavorites: 1} : {}),
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

    getMyTaxiOffers({params = {}}) {
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
