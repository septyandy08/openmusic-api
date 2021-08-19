const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { mapDBToModel } = require('../../utils');
const NotFoundErrorApp = require('../../exceptions/NotFoundErrorApp');

class SongsAppService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongApp(payload) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
            values: [id, ...Object.values(payload), insertedAt],
        };

        const result = await this._pool.query(query); 

        if (!result.rows[0].id) {
            throw new InvariantErrorApp('Lagu tidak berhasil ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongsApp() {
        const result = await this._pool.query('SELECT id, title, performer FROM songs');
        return result.rows.map(mapDBToModel);
    }

    async getSongAppById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('Lagu tidak berhasil didapatkan');
        }
        
        return result.rows.map(mapDBToModel)[0]; 
    }

    async editSongAppById(id, { title, year, performer, genre, duration }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        };
        
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('Tidak berhasil memperbarui lagu. ID tidak dapat ditemukan');
        }
    }

    async deleteSongAppById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };
        
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('Lagu tidak berhasil dihapus. ID tidak dapat ditemukan');
        }
    }
}

module.exports = SongsAppService;
