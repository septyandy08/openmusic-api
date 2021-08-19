const ClientErrorApp = require('./ClientErrorApp');

class NotFoundErrorApp extends ClientErrorApp {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundErrorApp';
    }
} 

module.exports = NotFoundErrorApp;
