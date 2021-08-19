const amqp = require('amqplib');
const { Pool } = require('pg');
const NotFoundErrorApp = require('../../exceptions/NotFoundErrorApp');
const AuthorizationErrorApp = require('../../exceptions/AuthorizationErrorApp');

const ProducerAppService = {
    sendMessage: async (queue, message) => {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, {
            durable: true,
        });

        await channel.sendToQueue(queue, Buffer.from(message));

        setTimeout(() => {
            connection.close();
        }, 1000);
    },

    async verifyPlaylistsAppOwner(playlistId, owner) {
        
        this._pool = new Pool();

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
    },
};

module.exports = ProducerAppService;
