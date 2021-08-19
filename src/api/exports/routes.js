const routes = (handler) => [
    {
        method: 'POST',
        path: '/exports/playlists/{playlistId}',
        handler: handler.postExportPlaylistsAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
];

module.exports = routes;
