const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistsAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistAppByIdHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
];

module.exports = routes;
