const UploadsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'uploads',
    version: '1.0.0',
    register: async (server, { 
        storageAppService, 
        validator,
    }) => {
        const uploadsAppHandler = new UploadsAppHandler(
            storageAppService, 
            validator,
        );
        server.route(routes(uploadsAppHandler));
    },
};
