const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const { mapDBToModel } = require('../../utils');
const NotFoundErrorApp = require('../../exceptions/NotFoundErrorApp');
const AuthorizationErrorApp = require('../../exceptions/AuthorizationErrorApp');
const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class PlaylistSongAppService {
    constructor(collaborationAppService, cacheAppService) {
        this._pool = new Pool();
        this._collaborationAppService = collaborationAppService;
        this._cacheAppService = cacheAppService;
    }
    
    async addSongPlaylistApp({ 
        playlistId, 
        songId, 
    }) {
        const id = `playlistsongs-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, playlistId, songId, insertedAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantErrorApp('Lagu tidak berhasil ditambahkan');
        }
        await this._cacheAppService.delete(`playlist:${id}`);
        return result.rows[0].id;
    }

    async verifyNewSongPlaylistsApp(song_id, playlist_id) {
        const query = {
                text: 'SELECT song_id FROM playlistsongs WHERE song_id = $1 and playlist_id = $2',
                values: [song_id, playlist_id],
        };

        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantErrorApp('Tidak berhasil menambahkan lagu. Lagu ini sudah ada di dalam playlist.');
        }
    }

    async verifyPlaylistsSongAppOwner(playlistId, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('Playlist tidak dapat ditemukan');
        }
        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationErrorApp('Anda tidak mempunyai hak akses ke dalam resource ini');
        }
    }

    async getPlaylistSongApp(id) {
        try {
            const result = await this._cacheAppService.get(`playlist:${id}`);
            return JSON.parse(result);
        
        } catch (error) {
            const query = {
                text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs, songs
                WHERE songs.id = playlistsongs.song_id and playlistsongs.playlist_id = $1`,
                values: [id],
            };
    
            const result = await this._pool.query(query);
            const mappedResult = result.rows.map(mapDBToModel);
            await this._cacheAppService.set(`playlist:${id}`, JSON.stringify(mappedResult));
            return mappedResult;
        }
    }

    async deletePlaylistSongApp(id, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 and song_id =$2 RETURNING id',
            values: [id, songId],
        };
    
        const result = await this._pool.query(query);
        await this._cacheAppService.delete(`playlist:${id}`);
    
        if (!result.rowCount) {
            throw new ClientErrorApp('Lagu tidak berhasil dihapus. ID tidak dapat ditemukan');
        }
    }

    async verifyPlaylistSongAppAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistsSongAppOwner(playlistId, userId);
        } catch (error) {
            try {
                await this._collaborationAppService.verifyCollaboratorApp(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistSongAppService;
