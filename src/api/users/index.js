const UsersAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'users',
    version: '1.0.0',
    register: async (server, { 
        usersAppService, 
        validator,
    }) => {
        const usersAppHandler = new UsersAppHandler(
            usersAppService, 
            validator,
        );
        server.route(routes(usersAppHandler));
    },
};
