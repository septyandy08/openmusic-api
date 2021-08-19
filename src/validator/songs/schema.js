const Joi = require('joi');
 
const SongAppPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1700).max(2021).required(),
    performer: Joi.string().required(),
    genre: Joi.string(),
    duration: Joi.number().integer(),
});
 
module.exports = { SongAppPayloadSchema };
