const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: handler.postPlaylistSongsAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: handler.getPlaylistSongsAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: handler.deletePlaylistSongsAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
];

module.exports = routes;
