const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { PlaylistSongsAppPayloadSchema } = require('./schema');

const PlaylistSongsAppValidator = {
    validatePlaylistSongsAppPayload: (payload) => {
        const validationAppResult = PlaylistSongsAppPayloadSchema.validate(payload);
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
};

module.exports = PlaylistSongsAppValidator;
