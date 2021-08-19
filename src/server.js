require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// songs
const songs = require('./api/songs');
const SongsAppService = require('./services/postgres/SongsAppService');
const SongsAppValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersAppService = require('./services/postgres/UsersAppService');
const UsersAppValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsAppService = require('./services/postgres/AuthenticationsAppService');
const AuthenticationsAppValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

// playlists
const playlists = require('./api/playlists');
const PlaylistsAppService = require('./services/postgres/PlaylistsAppService');
const PlaylistsAppValidator = require('./validator/playlists');

// playlistsongs
const playlistsong = require('./api/playlistsongs');
const PlaylistSongAppService = require('./services/postgres/PlaylistSongAppService');
const PlaylistSongAppValidator = require('./validator/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsAppService = require('./services/postgres/CollaborationsAppService');
const CollaborationsAppValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const ProducerAppService = require('./services/rabbitmq/ProducerAppService');
const ExportsAppValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageAppService = require('./services/storage/StorageAppService');
const UploadsAppValidator = require('./validator/uploads');

// cache
const CacheAppService = require('./services/redis/CacheAppService');

// client error
const ClientErrorApp = require('./exceptions/ClientErrorApp');

const init = async () => {
    const cacheAppService = new CacheAppService();
    const collaborationsAppService = new CollaborationsAppService(cacheAppService);
    const songsAppService = new SongsAppService();
    const usersAppService = new UsersAppService();
    const authenticationsAppService = new AuthenticationsAppService();
    const playlistsAppService = new PlaylistsAppService();
    const playlistSongAppService = new PlaylistSongAppService(
        collaborationsAppService, 
        cacheAppService,
    );
    const storageAppService = new StorageAppService(path.resolve(__dirname, 'api/uploads/file/images'));

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        
        if (response instanceof ClientErrorApp) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            
            newResponse.code(response.statusCode);
            return newResponse;
        } 
            
        return response.continue || response;
    });

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('songsapp_jwt_final', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
        plugin: songs,
        options: {
            songsAppService,
            validator: SongsAppValidator,
        },
    },
    {
        plugin: playlists,
        options: {
            playlistsAppService,
            validator: PlaylistsAppValidator,
        },
    },
    {
        plugin: playlistsong,
        options: {
            playlistSongAppService,
            validator: PlaylistSongAppValidator,
        },
    },
    {
        plugin: users,
        options: {
            usersAppService,
            validator: UsersAppValidator,
        },
    },
    {
        plugin: authentications,
        options: {
            authenticationsAppService,
            usersAppService,
            validator: AuthenticationsAppValidator,
            tokenManager: TokenManager,
        },
    },
    {
        plugin: collaborations,
        options: {
            collaborationsAppService,
            playlistSongAppService,
            validator: CollaborationsAppValidator,
        },
    },
    {
        plugin: _exports,
        options: {
            ProducerAppService,
            validator: ExportsAppValidator,
        },
    },
    {
        plugin: uploads,
        options: {
            storageAppService,
            validator: UploadsAppValidator,
        },
    },
]);
    
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
