const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postCollaborationAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollaborationAppHandler,
        options: {
            auth: 'songsapp_jwt_final',
        },
    },
];

module.exports = routes;
