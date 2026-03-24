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
        ),
        existing_import AS (
            SELECT
                lai.listing_id
            FROM
                (
                    SELECT
                        1
                    WHERE
                        :importSource::text IS NULL
                        OR :importMsgId::bigint IS NULL

                    UNION ALL

                    SELECT
                        1
                    FROM
                        LATERAL (
                            SELECT
                                pg_advisory_xact_lock(
                                    hashtext(:importSource),
                                    hashtext(:importMsgId::text)
                                )
                            WHERE
                                :importSource::text IS NOT NULL
                                AND :importMsgId::bigint IS NOT NULL
                        ) AS locked_import
                ) AS import_guard
                INNER JOIN listing_aggregator_imports AS lai ON
                    :importSource::text IS NOT NULL
                    AND :importMsgId::bigint IS NOT NULL
                    AND (
                        (lai.source = :importSource AND lai.msg_id = :importMsgId)
                        OR (
                            :importContentHash::text IS NOT NULL
                            AND lai.content_hash = :importContentHash
                        )
                    )
                -- Restrict to the calling account's imported listings of the correct kind only.
                -- This ensures listings created manually (without an import record) or belonging
                -- to a different account are never modified by the aggregator.
                INNER JOIN listings AS l_guard
                    ON l_guard.listing_id = lai.listing_id
                    AND l_guard.owner_account_id = :accountId
                    AND l_guard.kind = :kind
            ORDER BY
                -- Prefer exact (source, msg_id) match over cross-source content_hash match
                CASE WHEN lai.source = :importSource AND lai.msg_id = :importMsgId THEN 0 ELSE 1 END ASC
            LIMIT 1
        ),
        updated_listing AS (
            UPDATE listings AS l
            SET
                 owner_account_id = :accountId
                ,kind = :kind
                ,category = rc.category_name
                ,title = :title
                ,description = :description
                ,price = :price
                ,phone = :phone
                ,telegram = :telegram
                ,real_estate_type = :realEstateType
                ,photos = COALESCE(:photos, '[]'::jsonb)
                ,listing_category_id = rc.listing_category_id
                ,service_category_id = rc.service_category_id
                ,updated_at = NOW()
            FROM
                resolved_category AS rc
                INNER JOIN existing_import AS ei ON TRUE
            WHERE
                l.listing_id = ei.listing_id
            RETURNING
                 l.listing_id
                ,l.owner_account_id
                ,l.kind
                ,l.listing_category_id
                ,l.service_category_id
                ,l.category
                ,l.title
                ,l.description
                ,l.price
                ,l.phone
                ,l.telegram
                ,l.real_estate_type
                ,l.photos
                ,l.created_at
        ),
        inserted_listing AS (
            INSERT INTO listings (
                 owner_account_id
                ,kind
                ,category
                ,title
                ,description
                ,price
                ,phone
                ,telegram
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
                ,:phone
                ,:telegram
                ,:realEstateType
                ,COALESCE(:photos, '[]'::jsonb)
                ,rc.listing_category_id
                ,rc.service_category_id
            FROM
                resolved_category AS rc
            WHERE
                NOT EXISTS (SELECT 1 FROM existing_import)
            RETURNING
                 listing_id
                ,owner_account_id
                ,kind
                ,listing_category_id
                ,service_category_id
                ,category
                ,title
                ,description
                ,price
                ,phone
                ,telegram
                ,real_estate_type
                ,photos
                ,created_at
        ),
        saved_listing AS (
            SELECT * FROM updated_listing
            UNION ALL
            SELECT * FROM inserted_listing
        ),
        updated_import AS (
            UPDATE listing_aggregator_imports AS lai
            SET
                -- Only update source-specific fields when the match is from the same source.
                -- For cross-source content_hash matches, keep the original import's source/msg_id
                -- stable to prevent re-creation on subsequent aggregator runs.
                 msg_id = CASE WHEN lai.source = :importSource THEN :importMsgId ELSE lai.msg_id END
                ,message_date = :importDate::timestamptz
                ,permalink = CASE WHEN lai.source = :importSource THEN :importPermalink ELSE lai.permalink END
                ,content_hash = :importContentHash
                ,photo_object_keys = COALESCE(:importPhotoObjectKeys::jsonb, '[]'::jsonb)
                ,updated_at = NOW()
            FROM
                existing_import AS ei
            WHERE
                lai.listing_id = ei.listing_id
            RETURNING lai.listing_id
        ),
        inserted_import AS (
            INSERT INTO listing_aggregator_imports (
                 listing_id
                ,source
                ,msg_id
                ,message_date
                ,permalink
                ,content_hash
                ,photo_object_keys
            )
            SELECT
                 sl.listing_id
                ,:importSource
                ,:importMsgId
                ,:importDate::timestamptz
                ,:importPermalink
                ,:importContentHash
                ,COALESCE(:importPhotoObjectKeys::jsonb, '[]'::jsonb)
            FROM
                saved_listing AS sl
            WHERE
                :importSource::text IS NOT NULL
                AND :importMsgId::bigint IS NOT NULL
                AND :importDate::timestamptz IS NOT NULL
                AND NOT EXISTS (SELECT 1 FROM existing_import)
            RETURNING listing_id
        )
        SELECT
             sl.listing_id AS "listingId"
            ,sl.owner_account_id AS "accountId"
            ,sl.kind
            ,COALESCE(sl.listing_category_id, sl.service_category_id) AS "categoryId"
            ,sl.category
            ,sl.title
            ,sl.description
            ,sl.price
            ,sl.phone
            ,sl.telegram
            ,sl.real_estate_type AS "realEstateType"
            ,sl.photos
            ,COALESCE(lai.message_date, sl.created_at) AS "createdAt"
            ,CASE
                WHEN lai.listing_id IS NULL THEN NULL
                ELSE jsonb_build_object(
                     'source', lai.source
                    ,'msgId', lai.msg_id
                    ,'date', lai.message_date
                    ,'permalink', lai.permalink
                    ,'contentHash', lai.content_hash
                    ,'photoObjectKeys', lai.photo_object_keys
                )
            END AS "importMeta"
        FROM
            saved_listing AS sl
            LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = sl.listing_id;`,

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
        ),
        updated_listing AS (
            UPDATE listings AS l
            SET
                 category = rc.category_name
                ,title = :title
                ,description = :description
                ,price = :price
                ,phone = COALESCE(:phone, l.phone)
                ,telegram = COALESCE(:telegram, l.telegram)
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
                ,l.phone
                ,l.telegram
                ,l.real_estate_type AS "realEstateType"
                ,l.photos
                ,l.created_at AS "createdAt"
                ,l.updated_at AS "updatedAt"
        )
        SELECT
             ul."listingId"
            ,ul."accountId"
            ,ul.kind
            ,ul."categoryId"
            ,ul.category
            ,ul.title
            ,ul.description
            ,ul.price
            ,ul.phone
            ,ul.telegram
            ,ul."realEstateType"
            ,ul.photos
            ,COALESCE(lai.message_date, ul."createdAt") AS "createdAt"
            ,ul."updatedAt"
            ,CASE
                WHEN lai.listing_id IS NULL THEN NULL
                ELSE jsonb_build_object(
                     'source', lai.source
                    ,'msgId', lai.msg_id
                    ,'date', lai.message_date
                    ,'permalink', lai.permalink
                    ,'contentHash', lai.content_hash
                    ,'photoObjectKeys', lai.photo_object_keys
                )
            END AS "importMeta"
        FROM
            updated_listing AS ul
            LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = ul."listingId";`,

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
            ,COALESCE(lai.message_date, l.created_at) AS "createdAt"
            ,a.account_id AS "accountId"
            ,a.name AS "accountName"
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN l.phone
                ELSE COALESCE(l.phone, a.phone)
            END AS phone
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN NULL
                ELSE a.whatsapp
            END AS whatsapp
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN l.telegram
                ELSE COALESCE(l.telegram, a.telegram)
            END AS telegram
            ,COALESCE(lf.account_id IS NOT NULL, FALSE) AS "isFavorite"
            ,CASE
                WHEN lai.listing_id IS NULL THEN NULL
                ELSE jsonb_build_object(
                     'source', lai.source
                    ,'msgId', lai.msg_id
                    ,'date', lai.message_date
                    ,'permalink', lai.permalink
                    ,'contentHash', lai.content_hash
                    ,'photoObjectKeys', lai.photo_object_keys
                )
            END AS "importMeta"
        FROM
            listings AS l
            INNER JOIN accounts AS a ON a.account_id = l.owner_account_id
            LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
            LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
            LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = l.listing_id
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
            CASE WHEN :sortBy = 'date_desc' THEN COALESCE(lai.message_date, l.created_at) END DESC,
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
            ,COALESCE(lai.message_date, l.created_at) AS "createdAt"
            ,a.account_id AS "accountId"
            ,a.name AS "accountName"
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN l.phone
                ELSE COALESCE(l.phone, a.phone)
            END AS phone
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN NULL
                ELSE a.whatsapp
            END AS whatsapp
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN l.telegram
                ELSE COALESCE(l.telegram, a.telegram)
            END AS telegram
            ,COALESCE(lf.account_id IS NOT NULL, FALSE) AS "isFavorite"
            ,CASE
                WHEN lai.listing_id IS NULL THEN NULL
                ELSE jsonb_build_object(
                     'source', lai.source
                    ,'msgId', lai.msg_id
                    ,'date', lai.message_date
                    ,'permalink', lai.permalink
                    ,'contentHash', lai.content_hash
                    ,'photoObjectKeys', lai.photo_object_keys
                )
            END AS "importMeta"
        FROM
            listings AS l
            INNER JOIN accounts AS a ON a.account_id = l.owner_account_id
            LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
            LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
            LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = l.listing_id
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
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN l.phone
                ELSE COALESCE(l.phone, a.phone)
            END AS phone
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN NULL
                ELSE a.whatsapp
            END AS whatsapp
            ,CASE
                WHEN lai.listing_id IS NOT NULL THEN l.telegram
                ELSE COALESCE(l.telegram, a.telegram)
            END AS telegram
            ,l.real_estate_type AS "realEstateType"
            ,l.photos
            ,COALESCE(lai.message_date, l.created_at) AS "createdAt"
            ,l.is_active AS "isActive"
            ,CASE
                WHEN lai.listing_id IS NULL THEN NULL
                ELSE jsonb_build_object(
                     'source', lai.source
                    ,'msgId', lai.msg_id
                    ,'date', lai.message_date
                    ,'permalink', lai.permalink
                    ,'contentHash', lai.content_hash
                    ,'photoObjectKeys', lai.photo_object_keys
                )
            END AS "importMeta"
        FROM
            listings AS l
            INNER JOIN accounts AS a ON a.account_id = l.owner_account_id
            LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
            LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
            LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = l.listing_id
        WHERE
            l.owner_account_id = :accountId
            AND l.kind = :kind
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN l.price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN l.price END DESC,
            CASE WHEN :sortBy = 'date_desc' THEN COALESCE(lai.message_date, l.created_at) END DESC,
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

    getImportedListingPhotoKeys: `
        SELECT
             l.listing_id AS "listingId"
            ,lai.photo_object_keys AS "photoObjectKeys"
        FROM
            listing_aggregator_imports AS lai
            INNER JOIN listings AS l ON l.listing_id = lai.listing_id
        WHERE
            l.listing_id = :listingId
            AND l.owner_account_id = :accountId
            AND l.kind = :kind
            AND l.is_active = TRUE;`,

    getExpiredImportedListings: `
        SELECT
             l.listing_id AS "listingId"
            ,lai.photo_object_keys AS "photoObjectKeys"
        FROM
            listing_aggregator_imports AS lai
            INNER JOIN listings AS l ON l.listing_id = lai.listing_id
        WHERE
            l.owner_account_id = :accountId
            AND l.kind = :kind
            AND lai.message_date < :olderThan::timestamptz
        ORDER BY
            lai.message_date ASC,
            l.listing_id ASC;`,

    getImportedListingsForDedup: `
        SELECT
             l.listing_id AS "listingId"
            ,l.kind
            ,l.title
            ,l.description
            ,l.price
            ,l.phone
            ,l.telegram
            ,l.photos
            ,lai.source
            ,lai.msg_id AS "msgId"
            ,lai.message_date AS "messageDate"
            ,lai.permalink
            ,lai.content_hash AS "contentHash"
            ,lai.photo_object_keys AS "photoObjectKeys"
        FROM
            listing_aggregator_imports AS lai
            INNER JOIN listings AS l ON l.listing_id = lai.listing_id
        WHERE
            l.owner_account_id = :accountId
            AND l.kind = :kind
            AND l.is_active = TRUE
        ORDER BY
            lai.message_date ASC, l.listing_id ASC
        LIMIT :limit
        OFFSET :offset;`,

    getMyListingPhotoKeys: `
        SELECT
             l.listing_id AS "listingId"
            ,l.photos AS "photos"
            ,lai.photo_object_keys AS "photoObjectKeys"
        FROM
            listings AS l
            LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = l.listing_id
        WHERE
            l.listing_id = :listingId
            AND l.owner_account_id = :accountId
            AND l.kind = :kind
            AND l.is_active = TRUE;`,

    deleteMyListing: `
        WITH target AS (
            SELECT
                l.listing_id
            FROM
                listings AS l
            WHERE
                l.listing_id = :listingId
                AND l.owner_account_id = :accountId
                AND l.kind = :kind
        ),
        deleted_favorites AS (
            DELETE FROM listing_favorites
            WHERE listing_id IN (SELECT listing_id FROM target)
        ),
        deleted_listing AS (
            DELETE FROM listings
            WHERE listing_id IN (SELECT listing_id FROM target)
            RETURNING listing_id
        )
        SELECT
            listing_id AS "listingId"
        FROM
            deleted_listing;`,

    deleteImportedListing: `
        WITH target AS (
            SELECT
                l.listing_id
            FROM
                listings AS l
                INNER JOIN listing_aggregator_imports AS lai ON lai.listing_id = l.listing_id
            WHERE
                l.listing_id = :listingId
                AND l.owner_account_id = :accountId
                AND l.kind = :kind
        ),
        deleted_favorites AS (
            DELETE FROM listing_favorites
            WHERE listing_id IN (SELECT listing_id FROM target)
        ),
        deleted_listing AS (
            DELETE FROM listings
            WHERE listing_id IN (SELECT listing_id FROM target)
            RETURNING listing_id
        )
        SELECT
            listing_id AS "listingId"
        FROM
            deleted_listing;`,
};
