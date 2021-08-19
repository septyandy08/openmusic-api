const ExportsAppHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'exports',
    version: '1.0.0',
    register: async (server, { 
        ProducerAppService, 
        validator, 
    }) => {
        const exportsAppHandler = new ExportsAppHandler(
            ProducerAppService, 
            validator,
        );
        server.route(routes(exportsAppHandler));
    },
};
