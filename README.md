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
- `register` — регистрирует нового пользователя по имени, телефону и паролю.
- `signIn` — выполняет вход и возвращает сессию пользователя.
- `getSession` — проверяет и возвращает данные активной сессии по `sessionToken`.
- `signOut` — завершает сессию пользователя по `sessionToken`.
- `createOrUpdateAccount` — создаёт или обновляет профиль аккаунта (имя, контакты).
- `getProfile` — возвращает публичные/профильные данные аккаунта по `accountId`.

### listing
- `createListing` — создаёт новое объявление/услугу от имени пользователя.
- `updateListing` — обновляет существующее объявление пользователя.
- `getListings` — возвращает список объявлений с фильтрами, сортировкой и пагинацией.
- `getListingById` — возвращает детальную карточку объявления по `listingId`.
- `getMyListings` — возвращает объявления, созданные конкретным пользователем.
- `toggleListingFavorite` — добавляет или убирает объявление из избранного пользователя.

### taxi
- `createTaxiOffer` — создаёт новое предложение такси (город/межгород/груз).
- `updateTaxiOffer` — обновляет существующее предложение такси пользователя.
- `getTaxiOffers` — возвращает список предложений такси с фильтрами и пагинацией.
- `getTaxiOfferById` — возвращает детальную карточку предложения такси.
- `getMyTaxiOffers` — возвращает предложения такси, созданные текущим пользователем.
- `toggleTaxiFavorite` — добавляет или убирает предложение такси из избранного.

### food
- `createOrUpdateRestaurant` — создаёт новое заведение; при передаче `restaurantId` обновляет конкретное заведение владельца.
- `getMyRestaurant` — возвращает последнее созданное заведение пользователя по `accountId`.
- `getRestaurants` — возвращает список заведений с сортировкой и пагинацией.
- `createMenuItem` — создаёт новую позицию меню для заведения пользователя.
- `updateMenuItem` — обновляет существующую позицию меню.
- `deleteMenuItem` — удаляет позицию меню по `menuItemId`.
- `getMenuItems` — возвращает список блюд с фильтрами, сортировкой и пагинацией.
- `getMenuItemById` — возвращает детальную карточку блюда по `menuItemId`.
- `toggleMenuItemFavorite` — добавляет или убирает блюдо из избранного пользователя.

### media
- `initPhotoUpload` — выдаёт `presigned POST` для прямой загрузки изображения в S3.
- `buildPhotoUrl` — строит URL просмотра по `objectKey` (если настроен `IRCOM_S3_PUBLIC_BASE_URL`).

## S3 ENV

```text
IRCOM_S3_BUCKET=your-bucket
IRCOM_S3_REGION=eu-central-1
IRCOM_S3_ACCESS_KEY_ID=...
IRCOM_S3_SECRET_ACCESS_KEY=...
IRCOM_S3_SESSION_TOKEN=... # optional
IRCOM_S3_KEY_PREFIX=ircom/photos
IRCOM_S3_UPLOAD_ENDPOINT= # optional, для S3-compatible
IRCOM_S3_PUBLIC_BASE_URL=https://cdn.example.com
IRCOM_S3_MAX_UPLOAD_BYTES=10485760
IRCOM_S3_UPLOAD_EXPIRES_SECONDS=300
```
