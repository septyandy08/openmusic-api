const Joi = require('joi');

const PostAuthenticationAppPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const PutAuthenticationAppPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationAppPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});
module.exports = {
    PostAuthenticationAppPayloadSchema,
    PutAuthenticationAppPayloadSchema,
    DeleteAuthenticationAppPayloadSchema,
};
