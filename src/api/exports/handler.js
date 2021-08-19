const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class ExportsAppHandler {
    constructor(ProducerAppService, validator) {
        this._ProducerAppService = ProducerAppService;
        this._validator = validator;

        this.postExportPlaylistsAppHandler = this.postExportPlaylistsAppHandler.bind(this);
    }

    async postExportPlaylistsAppHandler(request, h) {
        try {
            this._validator.validateExportPlaylistsAppPayload(request.payload);
            const { playlistId } = request.params;
            const { id: userId } = request.auth.credentials;

            await this._ProducerAppService.verifyPlaylistsAppOwner(
                playlistId, 
                userId,
            );

            const message = {
                playlistId,
                targetEmail: request.payload.targetEmail,
            };

            await this._ProducerAppService.sendMessage('export:playlists-songapp', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda dalam daftar tunggu',
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

module.exports = ExportsAppHandler;
