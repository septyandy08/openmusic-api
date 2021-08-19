const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUserAppHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserAppByIdHandler,
    },
    {
        method: 'GET',
        path: '/users',
        handler: handler.getUsersAppByUsernameHandler,
    },
];

module.exports = routes;
