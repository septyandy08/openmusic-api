const ClientErrorApp = require('./ClientErrorApp');

class AuthorizationErrorApp extends ClientErrorApp {
    constructor(message) {
        super(message, 403);
        this.name = 'AuthorizationErrorApp';
    }
}

module.exports = AuthorizationErrorApp;
