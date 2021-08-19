const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { ExportPlaylistsAppPayloadSchema } = require('./schema');

const ExportsAppValidator = {
    validateExportPlaylistsAppPayload: (payload) => {
        const validationResult = ExportPlaylistsAppPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantErrorApp(validationResult.error.message);
        }
    },
};

module.exports = ExportsAppValidator;
