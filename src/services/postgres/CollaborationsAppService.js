const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');

class CollaborationsAppService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollaborationApp(playlistId, userId) {

        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantErrorApp('Kolaborasi tidak berhasil ditambahkan');
        }
        return result.rows[0].id;
    }

    async deleteCollaborationApp(playlistId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantErrorApp('Kolaborasi tidak berhasil dihapus');
        }

    }

    async verifyCollaboratorApp(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantErrorApp('Kolaborasi tidak berhasil diverifikasi');
        }
    }
}

module.exports = CollaborationsAppService;
