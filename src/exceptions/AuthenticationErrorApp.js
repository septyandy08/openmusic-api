const ClientErrorApp = require('./ClientErrorApp');

class AuthenticationErrorApp extends ClientErrorApp {
    constructor(message) {
        super(message, 401);
        this.name = 'AuthenticationErrorApp';
    }
}

module.exports = AuthenticationErrorApp;
