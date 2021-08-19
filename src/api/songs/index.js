const SongsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'songs',
    version: '1.0.0',
    register: async (server, { 
        songsAppService, 
        validator, 
    }) => {
        const songsAppHandler = new SongsAppHandler(
            songsAppService, 
            validator,
        );
        server.route(routes(songsAppHandler));
    },
};
