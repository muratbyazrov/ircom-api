# ircom-api

Backend для приложения ircom на базе `story-system`.

## Домены

- `account`: регистрация/обновление аккаунта, получение профиля.
- `listing`: объявления и услуги (создание, список, карточка, избранное).
- `taxi`: предложения такси (город/межгород, список, карточка, избранное).
- `food`: заведение и блюда (CRUD базового уровня + избранное блюд).

## ENV и запуск

```bash
npm install
npm run dev
```

Базовый URL (development):

```text
http://127.0.0.1:3002/ircom-api/v1
```

## Основные методы

### account
- `register`
- `signIn`
- `getSession`
- `signOut`
- `createOrUpdateAccount`
- `getProfile`

### listing
- `createListing`
- `updateListing`
- `getListings`
- `getListingById`
- `getMyListings`
- `toggleListingFavorite`

### taxi
- `createTaxiOffer`
- `updateTaxiOffer`
- `getTaxiOffers`
- `getTaxiOfferById`
- `getMyTaxiOffers`
- `toggleTaxiFavorite`

### food
- `createOrUpdateRestaurant`
- `getMyRestaurant`
- `createMenuItem`
- `updateMenuItem`
- `deleteMenuItem`
- `getMenuItems`
- `getMenuItemById`
- `toggleMenuItemFavorite`
