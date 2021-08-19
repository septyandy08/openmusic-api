const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { mapDBToModel } = require('../../utils');
const NotFoundErrorApp = require('../../exceptions/NotFoundErrorApp');
const AuthorizationErrorApp = require('../../exceptions/AuthorizationErrorApp');

class PlaylistsAppService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistApp({ 
        name, owner,
    }) {
        const id = `playlist-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, insertedAt, updatedAt, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantErrorApp('Playlist tidak berhasil ditambahkan');
        }

        return result.rows[0].id;
    }

    async verifyNewPlaylistsApp(name, owner) {
        const query = {
            text: 'SELECT name FROM playlists WHERE name = $1 and owner = $2',
            values: [name, owner],
        };

        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantErrorApp('Tidak berhasil menambahkan playlists. Nama playlists sudah dipakai.');
        }
    }

    async getPlaylistsApp(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            left JOIN collaborations ON collaborations.playlist_id = playlists.id
            right JOIN users ON users.id = playlists.owner
            WHERE playlists.owner = $1 OR collaborations.user_id = $1
            GROUP BY playlists.id, users.username`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        
        return result.rows.map(mapDBToModel);
    }

    async deletePlaylistAppById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('Playlists tidak berhasil dihapus. ID tidak dapat ditemukan');
        }
    }

    async verifyPlaylistAppOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('Playlists tidak dapat ditemukan');
        }
        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationErrorApp('Anda tidak mempunyai hak akses ke dalam resource ini');
        }
    }
}

module.exports = PlaylistsAppService;
