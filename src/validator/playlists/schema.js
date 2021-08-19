const Joi = require('joi');

const PlaylistAppPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

module.exports = { PlaylistAppPayloadSchema };
