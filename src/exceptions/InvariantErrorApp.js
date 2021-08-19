const ClientErrorApp = require('./ClientErrorApp');

class InvariantErrorApp extends ClientErrorApp {
    constructor(message) {
        super(message);
        this.name = 'InvariantErrorApp';
    }
}

module.exports = InvariantErrorApp;
