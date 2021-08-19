const CollaborationsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { 
        collaborationsAppService, 
        playlistSongAppService, 
        validator,
    }) => {
        const collaborationsAppHandler = new CollaborationsAppHandler(
            collaborationsAppService, 
            playlistSongAppService, 
            validator,
        );
        server.route(routes(collaborationsAppHandler));
    },
};
