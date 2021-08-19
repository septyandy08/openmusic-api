const Joi = require('joi');

const PlaylistSongsAppPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { PlaylistSongsAppPayloadSchema };
