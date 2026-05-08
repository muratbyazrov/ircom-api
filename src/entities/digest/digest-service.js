const {Story} = require('story-system');
const {getDigestStats, markDigestSent, setDigestFrequency, getDigestSettings} = require('./queries.js');

class DigestService {
    getDigestStats() {
        return Story.dbAdapter.execQuery({
            queryName: getDigestStats,
            params: {},
            options: {singularRow: true},
        });
    }

    markDigestSent({telegramUserId}) {
        return Story.dbAdapter.execQuery({
            queryName: markDigestSent,
            params: {telegramUserId},
        });
    }

    setDigestFrequency({telegramUserId, frequency}) {
        return Story.dbAdapter.execQuery({
            queryName: setDigestFrequency,
            params: {telegramUserId, frequency},
        });
    }

    getDigestSettings({telegramUserId}) {
        return Story.dbAdapter.execQuery({
            queryName: getDigestSettings,
            params: {telegramUserId},
            options: {singularRow: true},
        });
    }
}

module.exports = {DigestService};
