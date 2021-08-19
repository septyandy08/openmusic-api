class SongsAppHandler {
    constructor(songsAppService, validator) {
        this._songsAppService = songsAppService;
        this._validator = validator;

        this.postSongAppHandler = this.postSongAppHandler.bind(this);
        this.getSongsAppHandler = this.getSongsAppHandler.bind(this);
        this.getSongAppByIdHandler = this.getSongAppByIdHandler.bind(this);
        this.putSongAppByIdHandler = this.putSongAppByIdHandler.bind(this);
        this.deleteSongAppByIdHandler = this.deleteSongAppByIdHandler.bind(this);
    }

    async postSongAppHandler(request, h) {
        this._validator.validateSongAppPayload(request.payload);
        const { title = 'untitled', year, performer, genre, duration } = request.payload;
            
        const songId = await this._songsAppService.addSongApp({ 
            title, 
            year, 
            performer, 
            genre, 
            duration,
        });
            
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    
    }
        
    async getSongsAppHandler() {
        const songs = await this._songsAppService.getSongsApp();

        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async getSongAppByIdHandler(request) {
        const { id } = request.params;
            const song = await this._songsAppService.getSongAppById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        }

    async putSongAppByIdHandler(request) {
        this._validator.validateSongAppPayload(request.payload);
        const { title, year, performer, genre, duration } = request.payload;
        const { id } = request.params;
        await this._songsAppService.editSongAppById(id, { 
            title, 
            year, 
            performer, 
            genre, 
            duration, 
        });
        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        };
    }

    async deleteSongAppByIdHandler(request) {
        const { id } = request.params;
        await this._songsAppService.deleteSongAppById(id);
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = SongsAppHandler;
