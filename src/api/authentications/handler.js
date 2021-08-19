const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class AuthenticationsAppHandler {
    constructor(authenticationsAppService, usersAppService, tokenManager, validator) {
        this._authenticationsAppService = authenticationsAppService;
        this._usersAppService = usersAppService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationAppHandler = this.postAuthenticationAppHandler.bind(this);
        this.putAuthenticationAppHandler = this.putAuthenticationAppHandler.bind(this);
        this.deleteAuthenticationAppHandler = this.deleteAuthenticationAppHandler.bind(this);
    }
    
    async postAuthenticationAppHandler({ payload }, h) {
        try {
            this._validator.validatePostAuthenticationAppPayload(payload);
            
            const { username, password } = payload;
            const id = await this._usersAppService.verifyUserAppCredential(username, password);
            
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });

            await this._authenticationsAppService.addRefreshToken(refreshToken);

            const response = h.response({
                status: 'success',
                message: 'Authentication berhasil ditambahkan',
                data: {
                    accessToken,
                    refreshToken,
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
    
    async putAuthenticationAppHandler(request, h) {
        try {
            this._validator.validatePutAuthenticationAppPayload(request.payload);
            
            const { refreshToken } = request.payload;
            await this._authenticationsAppService.verifyRefreshToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = this._tokenManager.generateAccessToken({ id });
            return {
                status: 'success',
                message: 'Access Token berhasil diupdate',
                data: {
                    accessToken,
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

    async deleteAuthenticationAppHandler(request, h) {
        try {
            this._validator.validateDeleteAuthenticationAppPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authenticationsAppService.verifyRefreshToken(refreshToken);
            await this._authenticationsAppService.deleteRefreshToken(refreshToken);
    
            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
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

module.exports = AuthenticationsAppHandler;
