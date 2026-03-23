const {Story} = require('story-system');
const {
    createTaxiOffer,
    updateTaxiOffer,
    deleteTaxiOffer,
    getTaxiOffers,
    getTaxiOfferById,
    getMyTaxiOffers,
    toggleTaxiFavorite,
    getImportedTaxiOffersForDedup,
} = require('./queries.js');
const ROUTE_DIRECTION_BY_PLACES = Object.freeze({
    'Цхинвал|Владикавказ': 1,
    'Владикавказ|Цхинвал': 2,
});
const TAXI_MOSCOW_OFFSET_MINUTES = 3 * 60;
const TAXI_MOSCOW_OFFSET_MS = TAXI_MOSCOW_OFFSET_MINUTES * 60 * 1000;
const TAXI_VEHICLE_MAX = 40;
const TAXI_CONTACT_MAX = 20;
const TAXI_TELEGRAM_MAX = 64;

const normalizeOptionalText = (value, maxLength = null) => {
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    if (!trimmed.length) {
        return null;
    }
    if (!Number.isInteger(maxLength) || maxLength < 1) {
        return trimmed;
    }
    return trimmed.slice(0, maxLength);
};

const toValidDate = value => {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const toMoscowShiftedDate = value => {
    const date = toValidDate(value);
    if (!date) {
        return null;
    }
    return new Date(date.getTime() + TAXI_MOSCOW_OFFSET_MS);
};

const getMoscowDateTimeParts = value => {
    const shifted = toMoscowShiftedDate(value);
    if (!shifted) {
        return null;
    }

    return {
        year: shifted.getUTCFullYear(),
        month: shifted.getUTCMonth() + 1,
        day: shifted.getUTCDate(),
        hour: shifted.getUTCHours(),
        minute: shifted.getUTCMinutes(),
    };
};

const addDaysToCalendarDate = ({year, month, day}, diff) => {
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
    date.setUTCDate(date.getUTCDate() + diff);
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    };
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

    const utcMs = Date.UTC(
        parsedYear,
        parsedMonth - 1,
        parsedDay,
        parsedHours,
        parsedMinutes,
        0,
        0,
    ) - TAXI_MOSCOW_OFFSET_MS;
    const shifted = new Date(utcMs + TAXI_MOSCOW_OFFSET_MS);
    if (
        shifted.getUTCFullYear() !== parsedYear ||
        shifted.getUTCMonth() + 1 !== parsedMonth ||
        shifted.getUTCDate() !== parsedDay ||
        shifted.getUTCHours() !== parsedHours ||
        shifted.getUTCMinutes() !== parsedMinutes
    ) {
        return null;
    }

    return new Date(utcMs).toISOString();
};

const parseTaxiIsoValue = value => {
    const normalized = normalizeOptionalText(value);
    if (!normalized) {
        return null;
    }

    const isoMatch = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?)?(?:([zZ]|[+-]\d{2}:\d{2}))?$/,
    );
    if (!isoMatch) {
        return null;
    }

    if (isoMatch[7]) {
        const parsed = new Date(normalized);
        return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
    }

    return buildIsoFromDateParts({
        year: isoMatch[1],
        month: isoMatch[2],
        day: isoMatch[3],
        hours: isoMatch[4] || 0,
        minutes: isoMatch[5] || 0,
    });
};

const parseRelativeDate = value => {
    const normalized = value.toLowerCase();
    const now = getMoscowDateTimeParts(new Date());
    if (!now) {
        return null;
    }

    if (normalized.startsWith('сегодня')) {
        return {
            year: now.year,
            month: now.month,
            day: now.day,
        };
    }
    if (normalized.startsWith('завтра')) {
        const tomorrow = addDaysToCalendarDate(now, 1);
        return {
            year: tomorrow.year,
            month: tomorrow.month,
            day: tomorrow.day,
        };
    }
    if (normalized.startsWith('послезавтра')) {
        const dayAfterTomorrow = addDaysToCalendarDate(now, 2);
        return {
            year: dayAfterTomorrow.year,
            month: dayAfterTomorrow.month,
            day: dayAfterTomorrow.day,
        };
    }

    return null;
};

const normalizeDepartureAt = value => {
    const normalized = normalizeOptionalText(value);
    if (!normalized) {
        return null;
    }

    const parsedIsoValue = parseTaxiIsoValue(normalized);
    if (parsedIsoValue) {
        return parsedIsoValue;
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
const normalizePositiveInt = value => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
const normalizeRouteDirection = value => {
    const parsed = Number(value);
    return parsed === 1 || parsed === 2 ? parsed : null;
};
const normalizeRoutePlace = value => {
    const normalized = normalizeOptionalText(value);
    if (!normalized) {
        return null;
    }
    return normalized.slice(0, 60);
};
const normalizeRouteText = value => {
    const normalized = normalizeOptionalText(value);
    if (!normalized) {
        return null;
    }
    return normalized.slice(0, 160);
};
const normalizeVehicle = value => {
    const normalized = normalizeOptionalText(value, TAXI_VEHICLE_MAX);
    if (!normalized) {
        return null;
    }
    return normalized;
};
const resolveRouteDirectionFromPlaces = (fromPlace, toPlace) => {
    if (!fromPlace || !toPlace) {
        return null;
    }
    return ROUTE_DIRECTION_BY_PLACES[`${fromPlace}|${toPlace}`] || null;
};

const normalizeImportMeta = params => {
    const importMeta = params.importMeta || null;
    if (!importMeta) {
        return {
            importSource: null,
            importMsgId: null,
            importDate: null,
            importPermalink: null,
            importContentHash: null,
            importPhotoObjectKeys: null,
        };
    }

    return {
        importSource: importMeta.source || null,
        importMsgId: Number.isInteger(importMeta.msgId) ?
            importMeta.msgId :
            (typeof importMeta.msgId === 'string' ? Number.parseInt(importMeta.msgId, 10) || null : null),
        importDate: importMeta.date || null,
        importPermalink: importMeta.permalink || null,
        importContentHash: importMeta.contentHash || null,
        importPhotoObjectKeys: JSON.stringify(
            Array.isArray(importMeta.photoObjectKeys) ? importMeta.photoObjectKeys : [],
        ),
    };
};

const normalizeCarPhotos = params => {
    if (!Object.prototype.hasOwnProperty.call(params, 'carPhotos') || params.carPhotos === null) {
        return null;
    }
    return JSON.stringify(params.carPhotos);
};

const normalizeTaxiParams = params => {
    const departureAt = normalizeDepartureAt(params.departureAt);
    if (normalizeOptionalText(params.departureAt) && !departureAt) {
        throw new Story.errors.BadRequestError('Неверный формат departureAt. Используйте ISO 8601 (например, 2026-02-22T16:00:00+03:00)');
    }

    const fromPlace = normalizeRoutePlace(params.fromPlace);
    const toPlace = normalizeRoutePlace(params.toPlace);
    let routeText = normalizeRouteText(params.routeText);
    if (!routeText && fromPlace && toPlace) {
        routeText = `${fromPlace} - ${toPlace}`;
    }

    let routeDirection = null;
    if (params.direction === 2) {
        const explicitRouteDirection = normalizeRouteDirection(params.routeDirection);
        const inferredRouteDirection = resolveRouteDirectionFromPlaces(fromPlace, toPlace);
        routeDirection = explicitRouteDirection || inferredRouteDirection;
    }

    return {
        ...params,
        description: typeof params.description === 'string' ? params.description : '',
        phone: normalizeOptionalText(params.phone, TAXI_CONTACT_MAX),
        whatsapp: normalizeOptionalText(params.whatsapp, TAXI_CONTACT_MAX),
        telegram: normalizeOptionalText(params.telegram, TAXI_TELEGRAM_MAX),
        departureAt,
        routeDirection,
        fromPlace: params.direction === 2 ? fromPlace : null,
        toPlace: params.direction === 2 ? toPlace : null,
        routeText: params.direction === 2 ? routeText : null,
        vehicle: normalizeVehicle(params.vehicle),
        seatsTotal: normalizeOptionalInt(params.seatsTotal),
        seatsFree: normalizeOptionalInt(params.seatsFree),
        carPhotos: normalizeCarPhotos(params),
    };
};

const normalizeDepartureFrom = value => {
    const normalized = normalizeOptionalText(value);
    if (!normalized) {
        return null;
    }

    const departureFrom = normalizeDepartureAt(normalized);
    if (!departureFrom) {
        throw new Story.errors.BadRequestError('Неверный формат departureFrom. Используйте ISO 8601 (например, 2026-02-22T16:00:00+03:00)');
    }

    return departureFrom;
};

class TaxiService {
    createTaxiOffer({params}) {
        const queryParams = {
            ...normalizeTaxiParams(params),
            ...normalizeImportMeta(params),
        };

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
        const accountId = normalizePositiveInt(params.accountId);
        const direction = normalizePositiveInt(params.direction);
        const routeDirection = direction === 2 ? normalizeRouteDirection(params.routeDirection) : null;
        const departureFrom = normalizeDepartureFrom(params.departureFrom);
        const queryParams = {
            ...params,
            accountId,
            direction,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
            ...(params.onlyFavorites ? {onlyFavorites: 1} : {}),
            ...(routeDirection !== null ? {routeDirection} : {}),
            ...(departureFrom !== null ? {departureFrom} : {}),
        };

        return Story.dbAdapter.execQuery({
            queryName: getTaxiOffers,
            params: queryParams,
        });
    }

    getTaxiOfferById({params}) {
        const queryParams = {
            ...params,
            accountId: normalizePositiveInt(params.accountId),
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
        const accountId = normalizePositiveInt(params.accountId);
        if (accountId === null) {
            return [];
        }

        const direction = normalizePositiveInt(params.direction);
        const routeDirection = direction === 2 ? normalizeRouteDirection(params.routeDirection) : null;

        const queryParams = {
            ...params,
            accountId,
            limit: params.limit || 20,
            offset: params.offset || 0,
            sortBy: params.sortBy || 'date_desc',
            ...(direction !== null ? {direction} : {}),
            ...(routeDirection !== null ? {routeDirection} : {}),
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

    getImportedTaxiOffersForDedup({params = {}}) {
        const accountId = normalizePositiveInt(params.accountId);
        if (accountId === null) {
            return [];
        }

        const queryParams = {
            ...params,
            accountId,
            limit: params.limit || 200,
            offset: params.offset || 0,
        };

        return Story.dbAdapter.execQuery({
            queryName: getImportedTaxiOffersForDedup,
            params: queryParams,
        });
    }
}

module.exports = {TaxiService};
