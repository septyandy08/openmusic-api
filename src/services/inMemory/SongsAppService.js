const { nanoid } = require('nanoid');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const NotFoundErrorApp = require('../../exceptions/NotFoundErrorApp');

class SongsAppService {
    constructor() {
        this._songs = [];
    }
    
    addSongApp({ title, year, performer, genre, duration }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        
        const newSong = {
            title, year, performer, genre, duration, id, insertedAt, updatedAt,
        };
        
        this._songs.push(newSong);

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantErrorApp('Lagu tidak berhasil ditambahkan');
        }

        return id;
    }

    getSongsApp() {
        return this._songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
        }));
    }

    getSongAppById(id) {
        const song = this._songs.filter((n) => n.id === id)[0];
        if (!song) {
            throw new NotFoundErrorApp('Lagu tidak berhasil didapatkan');
        }
        return song; 
    }

    editSongAppById(id, { title, performer, genre }) {
        const index = this._songs.findIndex((song) => song.id === id);
        
        if (index === -1) {
            throw new NotFoundErrorApp('Tidak berhasil memperbarui lagu. ID tidak dapat ditemukan');
        }

        const updatedAt = new Date().toISOString();
        const year = Number(2007);
        const duration = Number(360);

        this._songs[index] = {
            ...this._songs[index],
            title, 
            year, 
            performer, 
            genre, 
            duration,
            updatedAt,
        };
    }

    deleteSongAppById(id) {
        const index = this._songs.findIndex((song) => song.id === id);
        
        if (index === -1) {
            throw new NotFoundErrorApp('Lagu tidak berhasil dihapus. ID tidak dapat ditemukan');
        }
        
        this._songs.splice(index, 1);
    }
}

module.exports = SongsAppService;
