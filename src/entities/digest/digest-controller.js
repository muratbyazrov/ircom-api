const {Story} = require('story-system');
const {emptySchema} = require('./schemas.js');

class DigestController {
    constructor(config, service) {
        this.service = service;
    }

    getDigestStats(data) {
        Story.validator.validate(data.params || {}, emptySchema);
        return this.service.getDigestStats();
    }
}

module.exports = {DigestController};
