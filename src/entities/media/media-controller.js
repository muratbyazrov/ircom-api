const {Story} = require('story-system');
const {
    initPhotoUploadSchema,
    buildPhotoUrlSchema,
    deletePhotoSchema,
} = require('./schemas.js');

class MediaController {
    constructor(config, service) {
        this.service = service;
    }

    initPhotoUpload(data) {
        Story.validator.validate(data.params, initPhotoUploadSchema);
        return this.service.initPhotoUpload(data);
    }

    buildPhotoUrl(data) {
        Story.validator.validate(data.params, buildPhotoUrlSchema);
        return this.service.buildPhotoUrl(data);
    }

    deletePhoto(data) {
        Story.validator.validate(data.params, deletePhotoSchema);
        return this.service.deletePhoto(data);
    }
}

module.exports = {MediaController};
