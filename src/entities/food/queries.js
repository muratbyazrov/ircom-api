module.exports = {
    createRestaurant: `
        INSERT INTO restaurants (
             owner_account_id
            ,name
            ,address
            ,description
            ,logo_url
            ,phone
            ,whatsapp
            ,telegram
            ,has_delivery
            ,delivery_mode
            ,delivery_price
        )
        VALUES (
             :accountId
            ,:name
            ,:address
            ,:description
            ,:logoUrl
            ,:phone
            ,:whatsapp
            ,:telegram
            ,COALESCE(:hasDelivery, FALSE)
            ,COALESCE(:deliveryMode, CASE WHEN COALESCE(:hasDelivery, FALSE) THEN 'free' ELSE 'none' END)
            ,CASE
                WHEN COALESCE(:deliveryMode, CASE WHEN COALESCE(:hasDelivery, FALSE) THEN 'free' ELSE 'none' END) = 'paid'
                    THEN GREATEST(COALESCE(:deliveryPrice, 0), 0)
                ELSE 0
             END
        )
        RETURNING
             restaurant_id AS "restaurantId"
            ,owner_account_id AS "accountId"
            ,name
            ,address
            ,description
            ,logo_url AS "logoUrl"
            ,phone
            ,whatsapp
            ,telegram
            ,(COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "hasDelivery"
            ,(COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "has_delivery"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryMode"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "delivery_mode"
            ,COALESCE(delivery_price, 0) AS "deliveryPrice"
            ,COALESCE(delivery_price, 0) AS "delivery_price"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryOption"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryType"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "delivery"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    updateRestaurant: `
        UPDATE restaurants
        SET
             name = COALESCE(:name, name)
            ,address = COALESCE(:address, address)
            ,description = COALESCE(:description, description)
            ,logo_url = COALESCE(:logoUrl, logo_url)
            ,phone = COALESCE(:phone, phone)
            ,whatsapp = COALESCE(:whatsapp, whatsapp)
            ,telegram = COALESCE(:telegram, telegram)
            ,has_delivery = COALESCE(:hasDelivery, has_delivery)
            ,delivery_mode = COALESCE(:deliveryMode, delivery_mode)
            ,delivery_price = CASE
                WHEN COALESCE(:deliveryMode, delivery_mode) = 'paid'
                    THEN GREATEST(COALESCE(:deliveryPrice, delivery_price, 0), 0)
                ELSE 0
             END
            ,updated_at = NOW()
        WHERE
            restaurant_id = :restaurantId
            AND owner_account_id = :accountId
        RETURNING
             restaurant_id AS "restaurantId"
            ,owner_account_id AS "accountId"
            ,name
            ,address
            ,description
            ,logo_url AS "logoUrl"
            ,phone
            ,whatsapp
            ,telegram
            ,(COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "hasDelivery"
            ,(COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "has_delivery"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryMode"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "delivery_mode"
            ,COALESCE(delivery_price, 0) AS "deliveryPrice"
            ,COALESCE(delivery_price, 0) AS "delivery_price"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryOption"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryType"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "delivery"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt";`,

    getMyRestaurant: `
        SELECT
             restaurant_id AS "restaurantId"
            ,owner_account_id AS "accountId"
            ,name
            ,address
            ,description
            ,logo_url AS "logoUrl"
            ,phone
            ,whatsapp
            ,telegram
            ,(COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "hasDelivery"
            ,(COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "has_delivery"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryMode"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "delivery_mode"
            ,COALESCE(delivery_price, 0) AS "deliveryPrice"
            ,COALESCE(delivery_price, 0) AS "delivery_price"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryOption"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "deliveryType"
            ,COALESCE(delivery_mode, CASE WHEN has_delivery THEN 'free' ELSE 'none' END) AS "delivery"
            ,created_at AS "createdAt"
            ,updated_at AS "updatedAt"
        FROM
            restaurants
        WHERE
            owner_account_id = :accountId
        ORDER BY
            restaurant_id DESC
        LIMIT 1;`,

    getRestaurants: `
        SELECT
             r.restaurant_id AS "restaurantId"
            ,r.name
            ,r.address
            ,r.description
            ,r.logo_url AS "logoUrl"
            ,r.phone
            ,r.whatsapp
            ,r.telegram
            ,(COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "hasDelivery"
            ,(COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) <> 'none') AS "has_delivery"
            ,COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) AS "deliveryMode"
            ,COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) AS "delivery_mode"
            ,COALESCE(r.delivery_price, 0) AS "deliveryPrice"
            ,COALESCE(r.delivery_price, 0) AS "delivery_price"
            ,COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) AS "deliveryOption"
            ,COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) AS "deliveryType"
            ,COALESCE(r.delivery_mode, CASE WHEN r.has_delivery THEN 'free' ELSE 'none' END) AS "delivery"
            ,r.created_at AS "createdAt"
            ,COUNT(m.menu_item_id)::int AS "menuItemsCount"
        FROM
            restaurants AS r
            LEFT JOIN menu_items AS m
                ON m.restaurant_id = r.restaurant_id
                AND m.is_active = TRUE
        GROUP BY
            r.restaurant_id
        ORDER BY
            /*sortNameAsc: r.name ASC, */
            /*sortDateDesc: r.created_at DESC, */
            r.restaurant_id DESC
        LIMIT :limit::int
        OFFSET :offset::int;`,

    createMenuItem: `
        WITH target_restaurant AS (
            SELECT
                r.restaurant_id
            FROM
                restaurants AS r
            WHERE
                r.owner_account_id = :accountId
                AND (:restaurantId::bigint IS NULL OR r.restaurant_id = :restaurantId::bigint)
            ORDER BY
                r.restaurant_id DESC
            LIMIT 1
        )
        INSERT INTO menu_items (
             restaurant_id
            ,category
            ,name
            ,description
            ,price
            ,is_available
            ,photos
        )
        SELECT
             tr.restaurant_id
            ,:category
            ,:name
            ,:description
            ,:price
            ,COALESCE(:isAvailable, TRUE)
            ,COALESCE(:photos, '[]'::jsonb)
        FROM
            target_restaurant AS tr
        RETURNING
             menu_item_id AS "menuItemId"
            ,restaurant_id AS "restaurantId"
            ,category
            ,name
            ,description
            ,price
            ,is_available AS "isAvailable"
            ,photos
            ,created_at AS "createdAt";`,

    updateMenuItem: `
        UPDATE menu_items AS m
        SET
             category = :category
            ,name = :name
            ,description = :description
            ,price = :price
            ,is_available = COALESCE(:isAvailable, TRUE)
            ,photos = COALESCE(:photos, '[]'::jsonb)
            ,updated_at = NOW()
        FROM
            restaurants AS r
        WHERE
            m.menu_item_id = :menuItemId
            AND r.restaurant_id = m.restaurant_id
            AND r.owner_account_id = :accountId
        RETURNING
             m.menu_item_id AS "menuItemId"
            ,m.restaurant_id AS "restaurantId"
            ,m.category
            ,m.name
            ,m.description
            ,m.price
            ,m.is_available AS "isAvailable"
            ,m.photos
            ,m.created_at AS "createdAt"
            ,m.updated_at AS "updatedAt";`,

    deleteMenuItem: `
        UPDATE menu_items AS m
        SET
             is_active = FALSE
            ,updated_at = NOW()
        FROM
            restaurants AS r
        WHERE
            m.menu_item_id = :menuItemId
            AND r.restaurant_id = m.restaurant_id
            AND r.owner_account_id = :accountId
        RETURNING
             m.menu_item_id AS "menuItemId"
            ,m.is_active AS "isActive";`,

    getMenuItems: `
        SELECT
             m.menu_item_id AS "menuItemId"
            ,m.restaurant_id AS "restaurantId"
            ,m.category
            ,m.name
            ,m.description
            ,m.price
            ,m.is_available AS "isAvailable"
            ,m.photos
            ,m.created_at AS "createdAt"
            ,r.name AS "restaurantName"
            ,r.address AS "restaurantAddress"
            ,r.logo_url AS "restaurantLogoUrl"
            ,r.phone
            ,r.whatsapp
            ,r.telegram
            ,COALESCE(mf.account_id IS NOT NULL, FALSE) AS "isFavorite"
        FROM
            menu_items AS m
            INNER JOIN restaurants AS r ON r.restaurant_id = m.restaurant_id
            LEFT JOIN menu_item_favorites AS mf
                ON mf.menu_item_id = m.menu_item_id
                AND mf.account_id = :accountId
        WHERE
            m.is_active = TRUE
            /*restaurantId: AND m.restaurant_id = :restaurantId */
            /*category: AND m.category = :category */
            /*onlyAvailable: AND m.is_available = TRUE */
            /*onlyFavorites: AND mf.account_id = :accountId */
        ORDER BY
            /*sortPriceAsc: m.price ASC, */
            /*sortPriceDesc: m.price DESC, */
            /*sortDateDesc: m.created_at DESC, */
            m.menu_item_id DESC
        LIMIT :limit::int
        OFFSET :offset::int;`,

    getMenuItemById: `
        SELECT
             m.menu_item_id AS "menuItemId"
            ,m.restaurant_id AS "restaurantId"
            ,m.category
            ,m.name
            ,m.description
            ,m.price
            ,m.is_available AS "isAvailable"
            ,m.photos
            ,m.created_at AS "createdAt"
            ,r.name AS "restaurantName"
            ,r.address AS "restaurantAddress"
            ,r.logo_url AS "restaurantLogoUrl"
            ,r.phone
            ,r.whatsapp
            ,r.telegram
            ,COALESCE(mf.account_id IS NOT NULL, FALSE) AS "isFavorite"
        FROM
            menu_items AS m
            INNER JOIN restaurants AS r ON r.restaurant_id = m.restaurant_id
            LEFT JOIN menu_item_favorites AS mf
                ON mf.menu_item_id = m.menu_item_id
                AND mf.account_id = :accountId
        WHERE
            m.menu_item_id = :menuItemId
            AND m.is_active = TRUE;`,

    toggleMenuItemFavorite: `
        WITH inserted AS (
            INSERT INTO menu_item_favorites (
                 account_id
                ,menu_item_id
            )
            VALUES (
                 :accountId
                ,:menuItemId
            )
            ON CONFLICT (account_id, menu_item_id) DO NOTHING
            RETURNING menu_item_id
        ),
        deleted AS (
            DELETE FROM menu_item_favorites
            WHERE
                account_id = :accountId
                AND menu_item_id = :menuItemId
                AND NOT EXISTS (SELECT 1 FROM inserted)
            RETURNING menu_item_id
        )
        SELECT
             :menuItemId AS "menuItemId"
            ,:accountId AS "accountId"
            ,EXISTS (SELECT 1 FROM inserted) AS "isFavorite";`,
};
