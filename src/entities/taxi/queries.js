module.exports = {
    createTaxiOffer: `
        WITH existing_import AS (
            SELECT
                tai.taxi_offer_id
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
                INNER JOIN taxi_aggregator_imports AS tai ON
                    :importSource::text IS NOT NULL
                    AND :importMsgId::bigint IS NOT NULL
                    AND tai.source = :importSource
                    AND tai.msg_id = :importMsgId
            LIMIT 1
        ),
        updated_taxi_offer AS (
            UPDATE taxi_offers AS t
            SET
                 owner_account_id = :accountId
                ,direction = :direction
                ,route_direction = :routeDirection
                ,from_place = :fromPlace
                ,to_place = :toPlace
                ,route_text = :routeText
                ,vehicle = :vehicle
                ,description = :description
                ,price = :price
                ,phone = :phone
                ,whatsapp = :whatsapp
                ,telegram = :telegram
                ,departure_at = :departureAt
                ,seats_total = :seatsTotal
                ,seats_free = :seatsFree
                ,car_photos = COALESCE(:carPhotos, '[]'::jsonb)
                ,updated_at = NOW()
            FROM
                existing_import AS ei
            WHERE
                t.taxi_offer_id = ei.taxi_offer_id
            RETURNING
                 t.taxi_offer_id
                ,t.owner_account_id
                ,t.direction
                ,t.route_direction
                ,t.from_place
                ,t.to_place
                ,t.route_text
                ,t.vehicle
                ,t.description
                ,t.price
                ,t.phone
                ,t.whatsapp
                ,t.telegram
                ,t.departure_at
                ,t.seats_total
                ,t.seats_free
                ,t.car_photos
                ,t.rating
                ,t.reviews_count
                ,t.created_at
        ),
        inserted_taxi_offer AS (
            INSERT INTO taxi_offers (
                 owner_account_id
                ,direction
                ,route_direction
                ,from_place
                ,to_place
                ,route_text
                ,vehicle
                ,description
                ,price
                ,phone
                ,whatsapp
                ,telegram
                ,departure_at
                ,seats_total
                ,seats_free
                ,car_photos
            )
            SELECT
                 :accountId
                ,:direction
                ,:routeDirection
                ,:fromPlace
                ,:toPlace
                ,:routeText
                ,:vehicle
                ,:description
                ,:price
                ,:phone
                ,:whatsapp
                ,:telegram
                ,:departureAt
                ,:seatsTotal
                ,:seatsFree
                ,COALESCE(:carPhotos, '[]'::jsonb)
            WHERE
                NOT EXISTS (SELECT 1 FROM existing_import)
            RETURNING
                 taxi_offer_id
                ,owner_account_id
                ,direction
                ,route_direction
                ,from_place
                ,to_place
                ,route_text
                ,vehicle
                ,description
                ,price
                ,phone
                ,whatsapp
                ,telegram
                ,departure_at
                ,seats_total
                ,seats_free
                ,car_photos
                ,rating
                ,reviews_count
                ,created_at
        ),
        saved_taxi_offer AS (
            SELECT * FROM updated_taxi_offer
            UNION ALL
            SELECT * FROM inserted_taxi_offer
        ),
        updated_import AS (
            UPDATE taxi_aggregator_imports AS tai
            SET
                 message_date = :importDate::timestamptz
                ,permalink = :importPermalink
                ,content_hash = :importContentHash
                ,photo_object_keys = COALESCE(:importPhotoObjectKeys::jsonb, '[]'::jsonb)
                ,updated_at = NOW()
            FROM
                existing_import AS ei
            WHERE
                tai.taxi_offer_id = ei.taxi_offer_id
            RETURNING tai.taxi_offer_id
        ),
        inserted_import AS (
            INSERT INTO taxi_aggregator_imports (
                 taxi_offer_id
                ,source
                ,msg_id
                ,message_date
                ,permalink
                ,content_hash
                ,photo_object_keys
            )
            SELECT
                 s.taxi_offer_id
                ,:importSource
                ,:importMsgId
                ,:importDate::timestamptz
                ,:importPermalink
                ,:importContentHash
                ,COALESCE(:importPhotoObjectKeys::jsonb, '[]'::jsonb)
            FROM
                saved_taxi_offer AS s
            WHERE
                :importSource::text IS NOT NULL
                AND :importMsgId::bigint IS NOT NULL
                AND :importDate::timestamptz IS NOT NULL
                AND NOT EXISTS (SELECT 1 FROM existing_import)
            RETURNING taxi_offer_id
        )
        SELECT
             s.taxi_offer_id AS "taxiOfferId"
            ,s.owner_account_id AS "accountId"
            ,s.direction
            ,s.route_direction AS "routeDirection"
            ,s.from_place AS "fromPlace"
            ,s.to_place AS "toPlace"
            ,s.route_text AS "routeText"
            ,s.vehicle
            ,s.description
            ,s.price
            ,s.phone
            ,s.whatsapp
            ,s.telegram
            ,s.departure_at AS "departureAt"
            ,s.seats_total AS "seatsTotal"
            ,s.seats_free AS "seatsFree"
            ,s.car_photos AS "carPhotos"
            ,s.rating
            ,s.reviews_count AS "reviewsCount"
            ,COALESCE(tai.message_date, s.created_at) AS "createdAt"
            ,CASE
                WHEN tai.taxi_offer_id IS NULL THEN NULL
                ELSE jsonb_build_object(
                     'source', tai.source
                    ,'msgId', tai.msg_id
                    ,'date', tai.message_date
                    ,'permalink', tai.permalink
                    ,'contentHash', tai.content_hash
                    ,'photoObjectKeys', tai.photo_object_keys
                )
            END AS "importMeta"
        FROM
            saved_taxi_offer AS s
            LEFT JOIN taxi_aggregator_imports AS tai ON tai.taxi_offer_id = s.taxi_offer_id;`,

    updateTaxiOffer: `
        UPDATE taxi_offers
        SET
             direction = :direction
            ,route_direction = :routeDirection
            ,from_place = :fromPlace
            ,to_place = :toPlace
            ,route_text = :routeText
            ,vehicle = :vehicle
            ,description = :description
            ,price = :price
            ,phone = :phone
            ,whatsapp = :whatsapp
            ,telegram = :telegram
            ,departure_at = :departureAt
            ,seats_total = :seatsTotal
            ,seats_free = :seatsFree
            ,car_photos = COALESCE(:carPhotos, '[]'::jsonb)
            ,updated_at = NOW()
        WHERE
            taxi_offer_id = :taxiOfferId
            AND owner_account_id = :accountId
            AND is_active = TRUE
        RETURNING
             taxi_offer_id AS "taxiOfferId"
            ,owner_account_id AS "accountId"
            ,direction
            ,route_direction AS "routeDirection"
            ,from_place AS "fromPlace"
            ,to_place AS "toPlace"
            ,route_text AS "routeText"
            ,vehicle
            ,description
            ,price
            ,phone
            ,whatsapp
            ,telegram
            ,departure_at AS "departureAt"
            ,seats_total AS "seatsTotal"
            ,seats_free AS "seatsFree"
            ,car_photos AS "carPhotos"
            ,rating
            ,reviews_count AS "reviewsCount"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    deleteTaxiOffer: `
        UPDATE taxi_offers
        SET
             is_active = FALSE
            ,updated_at = NOW()
        WHERE
            taxi_offer_id = :taxiOfferId
            AND owner_account_id = :accountId
            AND is_active = TRUE
        RETURNING
             taxi_offer_id AS "taxiOfferId"
            ,is_active AS "isActive";`,

    getTaxiOffers: `
        SELECT
             t.taxi_offer_id AS "taxiOfferId"
            ,t.direction
            ,t.route_direction AS "routeDirection"
            ,t.from_place AS "fromPlace"
            ,t.to_place AS "toPlace"
            ,t.route_text AS "routeText"
            ,t.vehicle
            ,t.description
            ,t.price
            ,t.phone
            ,t.whatsapp
            ,t.telegram
            ,t.departure_at AS "departureAt"
            ,t.seats_total AS "seatsTotal"
            ,t.seats_free AS "seatsFree"
            ,t.car_photos AS "carPhotos"
            ,t.rating
            ,t.reviews_count AS "reviewsCount"
            ,t.created_at AS "createdAt"
            ,COALESCE(tf.account_id IS NOT NULL, FALSE) AS "isFavorite"
        FROM
            taxi_offers AS t
            LEFT JOIN taxi_favorites AS tf
                ON tf.taxi_offer_id = t.taxi_offer_id
                AND tf.account_id = :accountId
        WHERE
            t.is_active = TRUE
            AND t.direction = :direction
            /*routeDirection: AND t.route_direction = :routeDirection */
            /*departureFrom: AND t.departure_at IS NOT NULL AND t.departure_at >= :departureFrom */
            /*onlyFavorites: AND tf.account_id = :accountId */
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN t.price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN t.price END DESC,
            CASE WHEN :sortBy = 'rating_desc' THEN t.rating END DESC,
            CASE WHEN :sortBy = 'departure_asc' THEN t.departure_at END ASC,
            CASE WHEN :sortBy = 'date_desc' THEN t.created_at END DESC,
            t.taxi_offer_id DESC
        LIMIT :limit
        OFFSET :offset;`,

    getTaxiOfferById: `
        SELECT
             t.taxi_offer_id AS "taxiOfferId"
            ,t.owner_account_id AS "accountId"
            ,t.direction
            ,t.route_direction AS "routeDirection"
            ,t.from_place AS "fromPlace"
            ,t.to_place AS "toPlace"
            ,t.route_text AS "routeText"
            ,t.vehicle
            ,t.description
            ,t.price
            ,t.phone
            ,t.whatsapp
            ,t.telegram
            ,t.departure_at AS "departureAt"
            ,t.seats_total AS "seatsTotal"
            ,t.seats_free AS "seatsFree"
            ,t.car_photos AS "carPhotos"
            ,t.rating
            ,t.reviews_count AS "reviewsCount"
            ,t.created_at AS "createdAt"
            ,COALESCE(tf.account_id IS NOT NULL, FALSE) AS "isFavorite"
        FROM
            taxi_offers AS t
            LEFT JOIN taxi_favorites AS tf
                ON tf.taxi_offer_id = t.taxi_offer_id
                AND tf.account_id = :accountId
        WHERE
            t.taxi_offer_id = :taxiOfferId
            AND t.is_active = TRUE;`,

    getMyTaxiOffers: `
        SELECT
             taxi_offer_id AS "taxiOfferId"
            ,direction
            ,route_direction AS "routeDirection"
            ,from_place AS "fromPlace"
            ,to_place AS "toPlace"
            ,route_text AS "routeText"
            ,vehicle
            ,description
            ,price
            ,phone
            ,whatsapp
            ,telegram
            ,departure_at AS "departureAt"
            ,seats_total AS "seatsTotal"
            ,seats_free AS "seatsFree"
            ,car_photos AS "carPhotos"
            ,rating
            ,reviews_count AS "reviewsCount"
            ,created_at AS "createdAt"
            ,is_active AS "isActive"
        FROM
            taxi_offers
        WHERE
            owner_account_id = :accountId
            AND is_active = TRUE
            /*direction: AND direction = :direction */
            /*routeDirection: AND route_direction = :routeDirection */
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN price END DESC,
            CASE WHEN :sortBy = 'rating_desc' THEN rating END DESC,
            CASE WHEN :sortBy = 'departure_asc' THEN departure_at END ASC,
            CASE WHEN :sortBy = 'date_desc' THEN created_at END DESC,
            taxi_offer_id DESC
        LIMIT :limit
        OFFSET :offset;`,

    toggleTaxiFavorite: `
        WITH inserted AS (
            INSERT INTO taxi_favorites (
                 account_id
                ,taxi_offer_id
            )
            VALUES (
                 :accountId
                ,:taxiOfferId
            )
            ON CONFLICT (account_id, taxi_offer_id) DO NOTHING
            RETURNING taxi_offer_id
        ),
        deleted AS (
            DELETE FROM taxi_favorites
            WHERE
                account_id = :accountId
                AND taxi_offer_id = :taxiOfferId
                AND NOT EXISTS (SELECT 1 FROM inserted)
            RETURNING taxi_offer_id
        )
        SELECT
             :taxiOfferId AS "taxiOfferId"
            ,:accountId AS "accountId"
            ,EXISTS (SELECT 1 FROM inserted) AS "isFavorite";`,
};
