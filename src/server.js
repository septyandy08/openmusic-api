require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');
const playlists = require('./api/playlists');

// playlistsongs
const PlaylistsSongService = require('./services/postgres/PlaylistSongService');
const PlaylistSongValidator = require('./validator/playlistsongs');
const playlistsong = require('./api/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const collaborationsService = new CollaborationsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService();
    const playlistSongService = new PlaylistsSongService(collaborationsService);

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
        
        if (response instanceof ClientError) {
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
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('songsapp_jwt', 'jwt', {
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
            service: songsService,
            validator: SongsValidator,
        },
    },
    {
        plugin: playlists,
        options: {
            service: playlistsService,
            validator: PlaylistsValidator,
        },
    },
    {
        plugin: playlistsong,
        options: {
            service: playlistSongService,
            validator: PlaylistSongValidator,
        },
    },
    {
        plugin: users,
        options: {
            service: usersService,
            validator: UsersValidator,
        },
    },
    {
        plugin: authentications,
        options: {
            authenticationsService,
            service: usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
        },
    },
    {
        plugin: collaborations,
        options: {
            collaborationsService,
            playlistSongService,
            validator: CollaborationsValidator,
        },
    },
]);
    
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
