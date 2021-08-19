const {
    PostAuthenticationAppPayloadSchema,
    PutAuthenticationAppPayloadSchema,
    DeleteAuthenticationAppPayloadSchema,
} = require('./schema');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');

const AuthenticationsAppValidator = {
    validatePostAuthenticationAppPayload: (payload) => {
        const validationAppResult = PostAuthenticationAppPayloadSchema.validate(payload);
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
    validatePutAuthenticationAppPayload: (payload) => {
        const validationAppResult = PutAuthenticationAppPayloadSchema.validate(payload);
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
    validateDeleteAuthenticationAppPayload: (payload) => {
        const validationAppResult = DeleteAuthenticationAppPayloadSchema.validate(payload);
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
};

module.exports = AuthenticationsAppValidator;
