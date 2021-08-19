const Joi = require('joi');
 
const UserAppPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

module.exports = { UserAppPayloadSchema };
