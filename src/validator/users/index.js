const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { UserAppPayloadSchema } = require('./schema');

const UsersAppValidator = {
    validateUserAppPayload: (payload) => {
        const validationAppResult = UserAppPayloadSchema.validate(payload);
        
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
};

module.exports = UsersAppValidator;
