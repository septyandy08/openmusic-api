const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { CollaborationAppPayloadSchema } = require('./schema');

const CollaborationsAppValidator = {
    validateCollaborationAppPayload: (payload) => {
        const validationAppResult = CollaborationAppPayloadSchema.validate(payload);

        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
};

module.exports = CollaborationsAppValidator;
