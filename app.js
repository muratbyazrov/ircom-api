const {Story} = require('story-system');
const {AccountController} = require('./src/entities/account/account-controller.js');
const {AccountService} = require('./src/entities/account/account-service.js');
const {ListingController} = require('./src/entities/listing/listing-controller.js');
const {ListingService} = require('./src/entities/listing/listing-service.js');
const {TaxiController} = require('./src/entities/taxi/taxi-controller.js');
const {TaxiService} = require('./src/entities/taxi/taxi-service.js');
const {FoodController} = require('./src/entities/food/food-controller.js');
const {FoodService} = require('./src/entities/food/food-service.js');

class App {
    constructor() {
        Story.configInit();
        Story.protocolsInit();
        Story.adaptersInit();
        Story.gateInit([
            {domain: 'account', Controller: AccountController, Service: AccountService},
            {domain: 'listing', Controller: ListingController, Service: ListingService},
            {domain: 'taxi', Controller: TaxiController, Service: TaxiService},
            {domain: 'food', Controller: FoodController, Service: FoodService},
        ]);
    }
}

// eslint-disable-next-line no-new
new App();
