const Joi = require('joi');

const CollaborationAppPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { CollaborationAppPayloadSchema };
