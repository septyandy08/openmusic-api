const PlaylistsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, { 
        playlistsAppService, 
        validator, 
    }) => {
        const playlistsAppHandler = new PlaylistsAppHandler(
            playlistsAppService, 
            validator,
        );
        server.route(routes(playlistsAppHandler));
    },
};
