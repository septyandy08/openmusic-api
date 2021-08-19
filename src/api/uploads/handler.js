const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class UploadsAppHandler {
    constructor(storageAppService, validator) {
        this._storageAppService = storageAppService;
        this._validator = validator;

        this.postUploadImageAppHandler = this.postUploadImageAppHandler.bind(this);
    }

    async postUploadImageAppHandler(request, h) {
        try {
            const { data } = request.payload;
            this._validator.validateImageHeadersApp(data.hapi.headers);

            const filename = await this._storageAppService.writeFile(data, data.hapi);

            const response = h.response({
                status: 'success',
                data: {
                    pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientErrorApp) {
                const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
            }
            
            // Server ERROR!
            const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi ketidakberhasilan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = UploadsAppHandler;
