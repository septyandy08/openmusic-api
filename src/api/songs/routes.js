const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongAppHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsAppHandler,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongAppByIdHandler,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongAppByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongAppByIdHandler,
    },
];

module.exports = routes;
