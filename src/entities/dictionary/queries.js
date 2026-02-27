module.exports = {
    getListingCategories: `
        SELECT
             category_id AS "categoryId"
            ,code
            ,name
            ,sort_order AS "sortOrder"
        FROM
            listing_categories
        WHERE
            is_active = TRUE
        ORDER BY
            sort_order ASC,
            category_id ASC;`,

    getServiceCategories: `
        SELECT
             category_id AS "categoryId"
            ,code
            ,name
            ,sort_order AS "sortOrder"
        FROM
            service_categories
        WHERE
            is_active = TRUE
        ORDER BY
            sort_order ASC,
            category_id ASC;`,

    getKitchenCategories: `
        SELECT
             category_id AS "categoryId"
            ,code
            ,name
            ,sort_order AS "sortOrder"
        FROM
            kitchen_categories
        WHERE
            is_active = TRUE
        ORDER BY
            sort_order ASC,
            category_id ASC;`,
};
