const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { ImageHeadersAppSchema } = require('./schema');

const UploadsAppValidator = {
    validateImageHeadersApp: (headers) => {
        const validationResult = ImageHeadersAppSchema.validate(headers);

        if (validationResult.error) {
            throw new InvariantErrorApp(validationResult.error.message);
        }
    },
};

module.exports = UploadsAppValidator;
