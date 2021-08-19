const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class PlaylistsAppHandler {
    constructor(playlistsAppService, validator) {
        this._playlistsAppService = playlistsAppService;
        this._validator = validator;

        this.postPlaylistsAppHandler = this.postPlaylistsAppHandler.bind(this);
        this.getPlaylistsAppHandler = this.getPlaylistsAppHandler.bind(this);
        this.deletePlaylistAppByIdHandler = this.deletePlaylistAppByIdHandler.bind(this);
    }

    async postPlaylistsAppHandler(request, h) {
        try {
            this._validator.validatePlaylistsAppPayload(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistsAppService.verifyNewPlaylistsApp(name, credentialId);
            const playlistId = await this._playlistsAppService.addPlaylistApp({
                name,
                owner: credentialId,
            });

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
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

    async getPlaylistsAppHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._playlistsAppService.getPlaylistsApp(credentialId);
            return {
                status: 'success',
                data: {
                    playlists,
                },
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

    async deletePlaylistAppByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistsAppService.verifyPlaylistAppOwner(id, credentialId);
            await this._playlistsAppService.deletePlaylistAppById(id, credentialId);
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
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

module.exports = PlaylistsAppHandler;
