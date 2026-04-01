const {Story} = require('story-system');
const {getDigestStats} = require('./queries.js');

class DigestService {
    getDigestStats() {
        return Story.dbAdapter.execQuery({
            queryName: getDigestStats,
            params: {},
            options: {singularRow: true},
        });
    }
}

module.exports = {DigestService};
