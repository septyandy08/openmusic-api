class ClientErrorApp extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ClientErrorApp';
    }
}

module.exports = ClientErrorApp;
