const {Story} = require('story-system');
const {MediaService} = require('../media/media-service.js');
const {
    createListing,
    updateListing,
    getListings,
    getListingById,
    getMyListings,
    toggleListingFavorite,
    getExpiredImportedListings,
    deleteImportedListing,
    getImportedListingsForDedup,
    getImportedListingPhotoKeys,
} = require('./queries.js');
const LISTING_PHONE_MAX = 20;
const LISTING_TELEGRAM_MAX = 64;
const LISTING_TITLE_MAX = 50;

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

const normalizeOptionalText = (value, maxLength = null) => {
    const text = String(value || '').trim();
    if (!text) {
        return null;
    }
    if (!Number.isInteger(maxLength) || maxLength < 1) {
        return text;
    }
    return text.slice(0, maxLength);
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
            normalizeOptionalInt(importMeta.msgId),
        importDate: importMeta.date || null,
        importPermalink: importMeta.permalink || null,
        importContentHash: importMeta.contentHash || null,
        importPhotoObjectKeys: JSON.stringify(
            Array.isArray(importMeta.photoObjectKeys) ? importMeta.photoObjectKeys : [],
        ),
    };
};

const normalizePhotoObjectKeys = value => {
    if (Array.isArray(value)) {
        return value.map(item => String(item || '').trim()).filter(Boolean);
    }

    if (typeof value === 'string' && value.trim().length > 0) {
        try {
            return normalizePhotoObjectKeys(JSON.parse(value));
        } catch (error) {
            return [];
        }
    }

    return [];
};

class ListingService {
    constructor(config = {}) {
        this.mediaService = new MediaService(config);
    }

    createListing({params}) {
        const categoryId = normalizeOptionalInt(params.categoryId);
        const queryParams = {
            ...params,
            categoryId,
            title: normalizeOptionalText(params.title, LISTING_TITLE_MAX),
            phone: normalizeOptionalText(params.phone, LISTING_PHONE_MAX),
            telegram: normalizeOptionalText(params.telegram, LISTING_TELEGRAM_MAX),
            realEstateType: Object.prototype.hasOwnProperty.call(params, 'realEstateType') ? params.realEstateType : null,
            photos: normalizePhotos(params),
            ...normalizeImportMeta(params),
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
            title: normalizeOptionalText(params.title, LISTING_TITLE_MAX),
            phone: normalizeOptionalText(params.phone, LISTING_PHONE_MAX),
            telegram: normalizeOptionalText(params.telegram, LISTING_TELEGRAM_MAX),
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

    getImportedListingsForDedup({params = {}}) {
        const queryParams = {
            ...params,
            limit: params.limit || 200,
            offset: params.offset || 0,
        };

        return Story.dbAdapter.execQuery({
            queryName: getImportedListingsForDedup,
            params: queryParams,
        });
    }

    async deleteImportedListingById({params}) {
        const listing = await Story.dbAdapter.execQuery({
            queryName: getImportedListingPhotoKeys,
            params: {
                listingId: params.listingId,
                accountId: params.accountId,
                kind: params.kind,
            },
            options: {singularRow: true},
        });

        if (!listing) {
            return {deletedListingId: null, deletedPhotos: 0, failedPhotos: 0};
        }

        const photoObjectKeys = normalizePhotoObjectKeys(listing.photoObjectKeys);
        let deletedPhotos = 0;
        let failedPhotos = 0;

        for (const objectKey of photoObjectKeys) {
            try {
                await this.mediaService.deletePhoto({
                    params: {accountId: params.accountId, objectKey},
                });
                deletedPhotos++;
            } catch (error) {
                failedPhotos++;
            }
        }

        if (failedPhotos > 0) {
            return {deletedListingId: null, deletedPhotos, failedPhotos};
        }

        const deleted = await Story.dbAdapter.execQuery({
            queryName: deleteImportedListing,
            params: {
                accountId: params.accountId,
                kind: params.kind,
                listingId: params.listingId,
            },
            options: {singularRow: true},
        });

        return {
            deletedListingId: deleted?.listingId || null,
            deletedPhotos,
            failedPhotos,
        };
    }

    async cleanupImportedListings({params}) {
        const expiredListings = await Story.dbAdapter.execQuery({
            queryName: getExpiredImportedListings,
            params,
        });

        let deletedListings = 0;
        let deletedPhotos = 0;
        let failedPhotos = 0;

        for (const listing of expiredListings) {
            const photoObjectKeys = normalizePhotoObjectKeys(listing.photoObjectKeys);
            let canDeleteListing = true;

            for (const objectKey of photoObjectKeys) {
                try {
                    await this.mediaService.deletePhoto({
                        params: {
                            accountId: params.accountId,
                            objectKey,
                        },
                    });
                    deletedPhotos++;
                } catch (error) {
                    failedPhotos++;
                    canDeleteListing = false;
                    break;
                }
            }

            if (!canDeleteListing) {
                continue;
            }

            const deleted = await Story.dbAdapter.execQuery({
                queryName: deleteImportedListing,
                params: {
                    accountId: params.accountId,
                    kind: params.kind,
                    listingId: listing.listingId,
                },
                options: {
                    singularRow: true,
                },
            });

            if (deleted && deleted.listingId) {
                deletedListings++;
            }
        }

        return {
            deletedListings,
            deletedPhotos,
            failedPhotos,
        };
    }
}

module.exports = {ListingService};
