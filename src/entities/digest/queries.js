module.exports = {
    getDigestStats: `
        WITH listing_stats AS (
            SELECT
                 COALESCE(lc.name, sc.name, l.category) AS category
                ,l.kind
                ,COUNT(*) AS cnt
                ,MIN(l.price) FILTER (WHERE l.price > 1) AS min_price
            FROM
                listings AS l
                LEFT JOIN listing_aggregator_imports AS lai ON lai.listing_id = l.listing_id
                LEFT JOIN listing_categories AS lc ON lc.category_id = l.listing_category_id
                LEFT JOIN service_categories AS sc ON sc.category_id = l.service_category_id
            WHERE
                l.is_active = TRUE
                AND COALESCE(lai.message_date, l.created_at) >= NOW() - INTERVAL '24 hours'
            GROUP BY
                 COALESCE(lc.name, sc.name, l.category)
                ,l.kind
        ),
        taxi_tomorrow AS (
            SELECT
                 COUNT(*) AS cnt
                ,MIN(price) FILTER (WHERE price > 1) AS min_price
                ,MIN(departure_at) AS first_departure
            FROM
                taxi_offers
            WHERE
                is_active = TRUE
                AND direction = 2
                AND departure_at >= (DATE_TRUNC('day', NOW() AT TIME ZONE 'Europe/Moscow') + INTERVAL '1 day') AT TIME ZONE 'Europe/Moscow'
                AND departure_at <  (DATE_TRUNC('day', NOW() AT TIME ZONE 'Europe/Moscow') + INTERVAL '2 days') AT TIME ZONE 'Europe/Moscow'
        )
        SELECT
             jsonb_agg(
                jsonb_build_object(
                     'category', ls.category
                    ,'kind',     ls.kind
                    ,'count',    ls.cnt
                    ,'minPrice', ls.min_price
                )
                ORDER BY ls.kind, ls.category
            ) FILTER (WHERE ls.category IS NOT NULL) AS listings
            ,(SELECT jsonb_build_object(
                 'count',          tt.cnt
                ,'minPrice',       tt.min_price
                ,'firstDeparture', tt.first_departure
            ) FROM taxi_tomorrow AS tt) AS taxi
        FROM
            listing_stats AS ls;`,
};
