const Joi = require('joi');

const ExportPlaylistsAppPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportPlaylistsAppPayloadSchema };
