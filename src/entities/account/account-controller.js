const {Story} = require('story-system');
const {
    registerSchema,
    signInSchema,
    telegramAuthSchema,
    getSessionSchema,
    signOutSchema,
    createOrUpdateAccountSchema,
    getProfileSchema,
} = require('./schemas.js');

class AccountController {
    constructor(config, service) {
        this.service = service;
    }

    register(data) {
        Story.validator.validate(data.params, registerSchema);
        return this.service.register(data);
    }

    signIn(data) {
        Story.validator.validate(data.params, signInSchema);
        return this.service.signIn(data);
    }

    telegramAuth(data) {
        Story.validator.validate(data.params, telegramAuthSchema);
        return this.service.telegramAuth(data);
    }

    getSession(data) {
        Story.validator.validate(data.params, getSessionSchema);
        return this.service.getSession(data);
    }

    signOut(data) {
        Story.validator.validate(data.params, signOutSchema);
        return this.service.signOut(data);
    }

    createOrUpdateAccount(data) {
        Story.validator.validate(data.params, createOrUpdateAccountSchema);
        return this.service.createOrUpdateAccount(data);
    }

    getProfile(data) {
        Story.validator.validate(data.params, getProfileSchema);
        return this.service.getProfile(data);
    }
}

module.exports = {AccountController};
