const routes = (handler) => [
    {
        method: 'POST',
        path: '/authentications',
        handler: handler.postAuthenticationAppHandler,
    },
    {
        method: 'PUT',
        path: '/authentications',
        handler: handler.putAuthenticationAppHandler,
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: handler.deleteAuthenticationAppHandler,
    },
];

module.exports = routes;
