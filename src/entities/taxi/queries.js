module.exports = {
    createTaxiOffer: `
        INSERT INTO taxi_offers (
             owner_account_id
            ,direction
            ,display_name
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
        VALUES (
             :accountId
            ,:direction
            ,:displayName
            ,:description
            ,:price
            ,:phone
            ,:whatsapp
            ,:telegram
            ,:departureAt
            ,:seatsTotal
            ,:seatsFree
            ,COALESCE(:carPhotos, '[]'::jsonb)
        )
        RETURNING
             taxi_offer_id AS "taxiOfferId"
            ,owner_account_id AS "accountId"
            ,direction
            ,display_name AS "displayName"
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
            ,created_at AS "createdAt";`,

    updateTaxiOffer: `
        UPDATE taxi_offers
        SET
             direction = :direction
            ,display_name = :displayName
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
            ,display_name AS "displayName"
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
            ,t.display_name AS "displayName"
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
                /*accountId: AND tf.account_id = :accountId */
        WHERE
            t.is_active = TRUE
            AND t.direction = :direction
            /*onlyFavorites: AND tf.account_id = :accountId */
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN t.price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN t.price END DESC,
            CASE WHEN :sortBy = 'rating_desc' THEN t.rating END DESC,
            CASE WHEN :sortBy = 'date_desc' THEN t.created_at END DESC,
            t.taxi_offer_id DESC
        LIMIT :limit
        OFFSET :offset;`,

    getTaxiOfferById: `
        SELECT
             t.taxi_offer_id AS "taxiOfferId"
            ,t.owner_account_id AS "accountId"
            ,t.direction
            ,t.display_name AS "displayName"
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
                /*accountId: AND tf.account_id = :accountId */
        WHERE
            t.taxi_offer_id = :taxiOfferId
            AND t.is_active = TRUE;`,

    getMyTaxiOffers: `
        SELECT
             taxi_offer_id AS "taxiOfferId"
            ,direction
            ,display_name AS "displayName"
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
        ORDER BY
            CASE WHEN :sortBy = 'price_asc' THEN price END ASC,
            CASE WHEN :sortBy = 'price_desc' THEN price END DESC,
            CASE WHEN :sortBy = 'rating_desc' THEN rating END DESC,
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
