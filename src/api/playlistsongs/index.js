const PlaylistSongsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlistsongs',
    version: '1.0.0',
    register: async (server, { 
        playlistSongAppService, 
        validator,
    }) => {
        const playlitsongsAppHandler = new PlaylistSongsAppHandler(
            playlistSongAppService, 
            validator,
        );
        server.route(routes(playlitsongsAppHandler));
    },
};
