const AuthenticationsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authenticationsAppService,
        usersAppService,
        tokenManager,
        validator,
    }) => {
        const authenticationsAppHandler = new AuthenticationsAppHandler(
            authenticationsAppService,
            usersAppService,
            tokenManager,
            validator,
        );
            
        server.route(routes(authenticationsAppHandler));
    },
};
