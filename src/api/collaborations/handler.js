const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class CollaborationsAppHandler {
    constructor(collaborationsAppService, playlistSongAppService, validator) {
        this._collaborationsAppService = collaborationsAppService;
        this._playlistSongAppService = playlistSongAppService;
        this._validator = validator;

        this.postCollaborationAppHandler = this.postCollaborationAppHandler.bind(this);
        this.deleteCollaborationAppHandler = this.deleteCollaborationAppHandler.bind(this);
    }

    async postCollaborationAppHandler(request, h) {
        try {
            this._validator.validateCollaborationAppPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistSongAppService.verifyPlaylistSongAppOwner(
                playlistId, 
                credentialId,
            );
            const collaborationId = await this._collaborationsAppService.addCollaborationApp(
                playlistId, userId,
            );

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId,
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

    async deleteCollaborationAppHandler(request, h) {
        try {
            this._validator.validateCollaborationAppPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistSongAppService.verifyPlaylistSongAppOwner(
                playlistId, 
                credentialId,
            );
            await this._collaborationsAppService.deleteCollaborationApp(playlistId, userId);
    
            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            };
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

module.exports = CollaborationsAppHandler;
