module.exports = {
    createListing: `
        INSERT INTO listings (
             owner_account_id
            ,kind
            ,category
            ,title
            ,description
            ,price
            ,real_estate_type
            ,photos
        )
        VALUES (
             :accountId
            ,:kind
            ,:category
            ,:title
            ,:description
            ,:price
            ,:realEstateType
            ,COALESCE(:photos, '[]'::jsonb)
        )
        RETURNING
             listing_id AS "listingId"
            ,owner_account_id AS "accountId"
            ,kind
            ,category
            ,title
            ,description
            ,price
            ,real_estate_type AS "realEstateType"
            ,photos
            ,created_at AS "createdAt";`,

    getListings: `
        SELECT
             l.listing_id AS "listingId"
            ,l.kind
            ,l.category
            ,l.title
            ,l.description
            ,l.price
            ,l.real_estate_type AS "realEstateType"
            ,l.photos
            ,l.created_at AS "createdAt"
            ,a.account_id AS "accountId"
            ,a.name AS "accountName"
            ,a.phone
            ,a.whatsapp
            ,a.telegram
            ,COALESCE(lf.account_id IS NOT NULL, FALSE) AS "isFavorite"
        FROM
            listings AS l
            INNER JOIN accounts AS a ON a.account_id = l.owner_account_id
            LEFT JOIN listing_favorites AS lf
                ON lf.listing_id = l.listing_id
                /*accountId: AND lf.account_id = :accountId */
        WHERE
            l.is_active = TRUE
            AND l.kind = :kind
            /*category: AND l.category = :category */
            /*onlyFavorites: AND lf.account_id = :accountId */
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN l.price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN l.price END DESC,
            CASE WHEN :sortBy = 'date_desc' THEN l.created_at END DESC,
            l.listing_id DESC
        LIMIT :limit
        OFFSET :offset;`,

    getListingById: `
        SELECT
             l.listing_id AS "listingId"
            ,l.kind
            ,l.category
            ,l.title
            ,l.description
            ,l.price
            ,l.real_estate_type AS "realEstateType"
            ,l.photos
            ,l.created_at AS "createdAt"
            ,a.account_id AS "accountId"
            ,a.name AS "accountName"
            ,a.phone
            ,a.whatsapp
            ,a.telegram
            ,COALESCE(lf.account_id IS NOT NULL, FALSE) AS "isFavorite"
        FROM
            listings AS l
            INNER JOIN accounts AS a ON a.account_id = l.owner_account_id
            LEFT JOIN listing_favorites AS lf
                ON lf.listing_id = l.listing_id
                /*accountId: AND lf.account_id = :accountId */
        WHERE
            l.listing_id = :listingId
            AND l.is_active = TRUE;`,

    getMyListings: `
        SELECT
             listing_id AS "listingId"
            ,kind
            ,category
            ,title
            ,description
            ,price
            ,real_estate_type AS "realEstateType"
            ,photos
            ,created_at AS "createdAt"
            ,is_active AS "isActive"
        FROM
            listings
        WHERE
            owner_account_id = :accountId
            AND kind = :kind
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN price END DESC,
            CASE WHEN :sortBy = 'date_desc' THEN created_at END DESC,
            listing_id DESC
        LIMIT :limit
        OFFSET :offset;`,

    toggleListingFavorite: `
        WITH inserted AS (
            INSERT INTO listing_favorites (
                 account_id
                ,listing_id
            )
            VALUES (
                 :accountId
                ,:listingId
            )
            ON CONFLICT (account_id, listing_id) DO NOTHING
            RETURNING listing_id
        ),
        deleted AS (
            DELETE FROM listing_favorites
            WHERE
                account_id = :accountId
                AND listing_id = :listingId
                AND NOT EXISTS (SELECT 1 FROM inserted)
            RETURNING listing_id
        )
        SELECT
             :listingId AS "listingId"
            ,:accountId AS "accountId"
            ,EXISTS (SELECT 1 FROM inserted) AS "isFavorite";`,
};
