const {Story} = require('story-system');
const {emptySchema, markDigestSentSchema, setDigestFrequencySchema, getDigestSettingsSchema} = require('./schemas.js');

class DigestController {
    constructor(config, service) {
        this.service = service;
    }

    getDigestStats(data) {
        Story.validator.validate(data.params || {}, emptySchema);
        return this.service.getDigestStats();
    }

    markDigestSent(data) {
        Story.validator.validate(data.params || {}, markDigestSentSchema);
        return this.service.markDigestSent(data.params);
    }

    setDigestFrequency(data) {
        Story.validator.validate(data.params || {}, setDigestFrequencySchema);
        return this.service.setDigestFrequency(data.params);
    }

    getDigestSettings(data) {
        Story.validator.validate(data.params || {}, getDigestSettingsSchema);
        return this.service.getDigestSettings(data.params);
    }
}

module.exports = {DigestController};
