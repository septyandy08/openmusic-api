const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { SongAppPayloadSchema } = require('./schema');

const SongsAppValidator = {
    validateSongAppPayload: (payload) => {
        const validationAppResult = SongAppPayloadSchema.validate(payload);
        if (validationAppResult.error) {
            throw new InvariantErrorApp(validationAppResult.error.message);
        }
    },
};

module.exports = SongsAppValidator;
