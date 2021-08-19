const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class PlaylistSongsAppHandler {
    constructor(playlistSongAppService, validator) {
        this._playlistSongAppService = playlistSongAppService;
        this._validator = validator;

        this.postPlaylistSongsAppHandler = this.postPlaylistSongsAppHandler.bind(this);
        this.getPlaylistSongsAppHandler = this.getPlaylistSongsAppHandler.bind(this);
        this.deletePlaylistSongsAppHandler = this.deletePlaylistSongsAppHandler.bind(this);
    }

    async postPlaylistSongsAppHandler(request, h) {
        try {
            this._validator.validatePlaylistSongsAppPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { songId = 'untitled' } = request.payload;
            const { playlistId } = request.params;

            await this._playlistSongAppService.verifyPlaylistSongAppAccess(
                playlistId, 
                credentialId, 
            );
            await this._playlistSongAppService.verifyNewSongPlaylistsApp(songId, playlistId);
            const playlistid = await this._playlistSongAppService.addSongPlaylistApp({
                playlistId,
                songId,
            });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan pada playlist',
                data: {
                    playlistid,
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

    async getPlaylistSongsAppHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistSongAppService.verifyPlaylistSongAppAccess(
                playlistId, 
                credentialId,
            );
            const songs = await this._playlistSongAppService.getPlaylistSongApp(playlistId);
            return {
                status: 'success',
                data: {
                    songs,
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

    async deletePlaylistSongsAppHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { songId = 'untitled' } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistSongAppService.verifyPlaylistSongAppAccess(
                playlistId, 
                credentialId,
            );
            await this._playlistSongAppService.deletePlaylistSongApp(playlistId, songId);
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
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

module.exports = PlaylistSongsAppHandler;
