const {Story} = require('story-system');
const {
    createTaxiOffer,
    updateTaxiOffer,
    deleteTaxiOffer,
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

const buildIsoFromDateParts = ({year, month, day, hours = 0, minutes = 0}) => {
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    const parsedDay = Number(day);
    const parsedHours = Number(hours);
    const parsedMinutes = Number(minutes);

    if (!Number.isInteger(parsedYear) || !Number.isInteger(parsedMonth) || !Number.isInteger(parsedDay)) {
        return null;
    }
    if (!Number.isInteger(parsedHours) || !Number.isInteger(parsedMinutes)) {
        return null;
    }
    if (parsedMonth < 1 || parsedMonth > 12 || parsedDay < 1 || parsedDay > 31) {
        return null;
    }
    if (parsedHours < 0 || parsedHours > 23 || parsedMinutes < 0 || parsedMinutes > 59) {
        return null;
    }

    const date = new Date(parsedYear, parsedMonth - 1, parsedDay, parsedHours, parsedMinutes, 0, 0);
    if (
        date.getFullYear() !== parsedYear ||
        date.getMonth() !== parsedMonth - 1 ||
        date.getDate() !== parsedDay ||
        date.getHours() !== parsedHours ||
        date.getMinutes() !== parsedMinutes
    ) {
        return null;
    }

    return date.toISOString();
};

const parseRelativeDate = value => {
    const normalized = value.toLowerCase();
    const now = new Date();

    if (normalized.startsWith('сегодня')) {
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
        };
    }
    if (normalized.startsWith('завтра')) {
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return {
            year: tomorrow.getFullYear(),
            month: tomorrow.getMonth() + 1,
            day: tomorrow.getDate(),
        };
    }
    if (normalized.startsWith('послезавтра')) {
        const dayAfterTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
        return {
            year: dayAfterTomorrow.getFullYear(),
            month: dayAfterTomorrow.getMonth() + 1,
            day: dayAfterTomorrow.getDate(),
        };
    }

    return null;
};

const normalizeDepartureAt = value => {
    const normalized = normalizeOptionalText(value);
    if (!normalized) {
        return null;
    }

    const nativeParsed = new Date(normalized);
    if (!Number.isNaN(nativeParsed.getTime())) {
        return nativeParsed.toISOString();
    }

    const relativeWithDateMatch = normalized.match(/^(сегодня|завтра|послезавтра)\s*\((\d{2})\.(\d{2})\.(\d{4})\)\s+(\d{1,2}):(\d{2})$/i);
    if (relativeWithDateMatch) {
        return buildIsoFromDateParts({
            day: relativeWithDateMatch[2],
            month: relativeWithDateMatch[3],
            year: relativeWithDateMatch[4],
            hours: relativeWithDateMatch[5],
            minutes: relativeWithDateMatch[6],
        });
    }

    const relativeTimeOnlyMatch = normalized.match(/^(сегодня|завтра|послезавтра)\s+(\d{1,2}):(\d{2})$/i);
    if (relativeTimeOnlyMatch) {
        const relativeDate = parseRelativeDate(relativeTimeOnlyMatch[1]);
        if (!relativeDate) {
            return null;
        }
        return buildIsoFromDateParts({
            ...relativeDate,
            hours: relativeTimeOnlyMatch[2],
            minutes: relativeTimeOnlyMatch[3],
        });
    }

    const localDateTimeMatch = normalized.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:[ T]+(\d{1,2}):(\d{2}))?$/);
    if (localDateTimeMatch) {
        return buildIsoFromDateParts({
            day: localDateTimeMatch[1],
            month: localDateTimeMatch[2],
            year: localDateTimeMatch[3],
            hours: localDateTimeMatch[4] || 0,
            minutes: localDateTimeMatch[5] || 0,
        });
    }

    return null;
};

const normalizeOptionalInt = value => (Number.isInteger(value) ? value : null);

const normalizeCarPhotos = params => {
    if (!Object.prototype.hasOwnProperty.call(params, 'carPhotos') || params.carPhotos === null) {
        return null;
    }
    return JSON.stringify(params.carPhotos);
};

const normalizeTaxiParams = params => {
    const departureAt = normalizeDepartureAt(params.departureAt);
    if (normalizeOptionalText(params.departureAt) && !departureAt) {
        throw new Story.errors.BadRequestError('Invalid departureAt format. Use ISO 8601 (e.g. 2026-02-22T16:00:00+03:00)');
    }

    return {
        ...params,
        description: typeof params.description === 'string' ? params.description : '',
        whatsapp: normalizeOptionalText(params.whatsapp),
        telegram: normalizeOptionalText(params.telegram),
        departureAt,
        seatsTotal: normalizeOptionalInt(params.seatsTotal),
        seatsFree: normalizeOptionalInt(params.seatsFree),
        carPhotos: normalizeCarPhotos(params),
    };
};

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

    deleteTaxiOffer({params}) {
        return Story.dbAdapter.execQuery({
            queryName: deleteTaxiOffer,
            params,
            options: {
                singularRow: true,
            },
        });
    }

    getTaxiOffers({params = {}}) {
        const accountId = Number.isInteger(params.accountId) ? params.accountId : null;
        const queryParams = {
            ...params,
            accountId,
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
        const queryParams = {
            ...params,
            accountId: Number.isInteger(params.accountId) ? params.accountId : null,
        };

        return Story.dbAdapter.execQuery({
            queryName: getTaxiOfferById,
            params: queryParams,
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
