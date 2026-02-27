const {Story} = require('story-system');
const fs = require('fs');
const path = require('path');
const {AccountController} = require('./src/entities/account/account-controller.js');
const {AccountService} = require('./src/entities/account/account-service.js');
const {ListingController} = require('./src/entities/listing/listing-controller.js');
const {ListingService} = require('./src/entities/listing/listing-service.js');
const {TaxiController} = require('./src/entities/taxi/taxi-controller.js');
const {TaxiService} = require('./src/entities/taxi/taxi-service.js');
const {FoodController} = require('./src/entities/food/food-controller.js');
const {FoodService} = require('./src/entities/food/food-service.js');
const {MediaController} = require('./src/entities/media/media-controller.js');
const {MediaService} = require('./src/entities/media/media-service.js');
const {DictionaryController} = require('./src/entities/dictionary/dictionary-controller.js');
const {DictionaryService} = require('./src/entities/dictionary/dictionary-service.js');

const loadLocalEnv = () => {
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        return;
    }
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }
        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex < 1) {
            return;
        }
        const key = trimmed.slice(0, separatorIndex).trim();
        if (!key || process.env[key] !== undefined) {
            return;
        }
        const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
    });
};

class App {
    constructor() {
        loadLocalEnv();
        Story.configInit();
        Story.protocolsInit();
        Story.adaptersInit();
        Story.gateInit([
            {domain: 'account', Controller: AccountController, Service: AccountService},
            {domain: 'listing', Controller: ListingController, Service: ListingService},
            {domain: 'taxi', Controller: TaxiController, Service: TaxiService},
            {domain: 'food', Controller: FoodController, Service: FoodService},
            {domain: 'media', Controller: MediaController, Service: MediaService},
            {domain: 'dictionary', Controller: DictionaryController, Service: DictionaryService},
        ]);
    }
}

// eslint-disable-next-line no-new
new App();
