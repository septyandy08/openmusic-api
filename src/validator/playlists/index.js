const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { PlaylistAppPayloadSchema } = require('./schema');

const PlaylistsAppValidator = {
    validatePlaylistsAppPayload: (payload) => {
        const validationAppResult = PlaylistAppPayloadSchema.validate(payload);
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
};

module.exports = PlaylistsAppValidator;
