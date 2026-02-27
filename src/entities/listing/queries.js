module.exports = {
    createListing: `
        WITH resolved_category AS (
            SELECT
                 lc.category_id AS listing_category_id
                ,NULL::bigint AS service_category_id
                ,lc.name AS category_name
            FROM
                listing_categories AS lc
            WHERE
                :kind = 1
                AND lc.is_active = TRUE
                AND (
                    (:categoryId::bigint IS NOT NULL AND lc.category_id = :categoryId::bigint)
                    OR (
                        :categoryId::bigint IS NULL
                        AND :category::text IS NOT NULL
                        AND LOWER(BTRIM(lc.name)) = LOWER(BTRIM(:category::text))
                    )
                )
            UNION ALL
            SELECT
                 NULL::bigint AS listing_category_id
                ,sc.category_id AS service_category_id
                ,sc.name AS category_name
            FROM
                service_categories AS sc
            WHERE
                :kind = 2
                AND sc.is_active = TRUE
                AND (
                    (:categoryId::bigint IS NOT NULL AND sc.category_id = :categoryId::bigint)
                    OR (
                        :categoryId::bigint IS NULL
                        AND :category::text IS NOT NULL
                        AND LOWER(BTRIM(sc.name)) = LOWER(BTRIM(:category::text))
                    )
                )
            LIMIT 1
        )
        INSERT INTO listings (
             owner_account_id
            ,kind
            ,category
            ,title
            ,description
            ,price
            ,real_estate_type
            ,photos
            ,listing_category_id
            ,service_category_id
        )
        SELECT
             :accountId
            ,:kind
            ,rc.category_name
            ,:title
            ,:description
            ,:price
            ,:realEstateType
            ,COALESCE(:photos, '[]'::jsonb)
            ,rc.listing_category_id
            ,rc.service_category_id
        FROM
            resolved_category AS rc
        RETURNING
             listing_id AS "listingId"
            ,owner_account_id AS "accountId"
            ,kind
            ,COALESCE(listing_category_id, service_category_id) AS "categoryId"
            ,category
            ,title
            ,description
            ,price
            ,real_estate_type AS "realEstateType"
            ,photos
            ,created_at AS "createdAt";`,

    updateListing: `
        WITH resolved_category AS (
            SELECT
                 lc.category_id AS listing_category_id
                ,NULL::bigint AS service_category_id
                ,lc.name AS category_name
            FROM
                listing_categories AS lc
            WHERE
                :kind = 1
                AND lc.is_active = TRUE
                AND (
                    (:categoryId::bigint IS NOT NULL AND lc.category_id = :categoryId::bigint)
                    OR (
                        :categoryId::bigint IS NULL
                        AND :category::text IS NOT NULL
                        AND LOWER(BTRIM(lc.name)) = LOWER(BTRIM(:category::text))
                    )
                )
            UNION ALL
            SELECT
                 NULL::bigint AS listing_category_id
                ,sc.category_id AS service_category_id
                ,sc.name AS category_name
            FROM
                service_categories AS sc
            WHERE
                :kind = 2
                AND sc.is_active = TRUE
                AND (
                    (:categoryId::bigint IS NOT NULL AND sc.category_id = :categoryId::bigint)
                    OR (
                        :categoryId::bigint IS NULL
                        AND :category::text IS NOT NULL
                        AND LOWER(BTRIM(sc.name)) = LOWER(BTRIM(:category::text))
                    )
                )
            LIMIT 1
        )
        UPDATE listings AS l
        SET
             category = rc.category_name
            ,title = :title
            ,description = :description
            ,price = :price
            ,real_estate_type = :realEstateType
            ,photos = COALESCE(:photos, '[]'::jsonb)
            ,listing_category_id = rc.listing_category_id
            ,service_category_id = rc.service_category_id
            ,updated_at = NOW()
        FROM
            resolved_category AS rc
        WHERE
            l.listing_id = :listingId
            AND l.owner_account_id = :accountId
            AND l.kind = :kind
            AND l.is_active = TRUE
        RETURNING
             l.listing_id AS "listingId"
            ,l.owner_account_id AS "accountId"
            ,l.kind
            ,COALESCE(l.listing_category_id, l.service_category_id) AS "categoryId"
            ,l.category
            ,l.title
            ,l.description
            ,l.price
            ,l.real_estate_type AS "realEstateType"
            ,l.photos
            ,l.created_at AS "createdAt"
            ,l.updated_at AS "updatedAt";`,

    getListings: `
        SELECT
             l.listing_id AS "listingId"
            ,l.kind
            ,COALESCE(l.listing_category_id, l.service_category_id) AS "categoryId"
            ,COALESCE(lc.name, sc.name, l.category) AS category
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
            LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
            LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
            LEFT JOIN listing_favorites AS lf
                ON lf.listing_id = l.listing_id
                AND lf.account_id = :accountId
        WHERE
            l.is_active = TRUE
            AND l.kind = :kind
            /*categoryId: AND COALESCE(l.listing_category_id, l.service_category_id) = :categoryId */
            /*category: AND LOWER(COALESCE(lc.name, sc.name, l.category)) = LOWER(:category) */
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
            ,COALESCE(l.listing_category_id, l.service_category_id) AS "categoryId"
            ,COALESCE(lc.name, sc.name, l.category) AS category
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
            LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
            LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
            LEFT JOIN listing_favorites AS lf
                ON lf.listing_id = l.listing_id
                AND lf.account_id = :accountId
        WHERE
            l.listing_id = :listingId
            AND l.is_active = TRUE;`,

    getMyListings: `
        SELECT
             l.listing_id AS "listingId"
            ,l.kind
            ,COALESCE(l.listing_category_id, l.service_category_id) AS "categoryId"
            ,COALESCE(lc.name, sc.name, l.category) AS category
            ,l.title
            ,l.description
            ,l.price
            ,l.real_estate_type AS "realEstateType"
            ,l.photos
            ,l.created_at AS "createdAt"
            ,l.is_active AS "isActive"
        FROM
            listings AS l
            LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
            LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
        WHERE
            l.owner_account_id = :accountId
            AND l.kind = :kind
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN l.price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN l.price END DESC,
            CASE WHEN :sortBy = 'date_desc' THEN l.created_at END DESC,
            l.listing_id DESC
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
