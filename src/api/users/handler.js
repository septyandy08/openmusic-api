const ClientErrorApp = require('../../exceptions/ClientErrorApp');

class UsersAppHandler {
    constructor(usersAppService, validator) {
        this._usersAppService = usersAppService;
        this._validator = validator;
        
        this.postUserAppHandler = this.postUserAppHandler.bind(this);
        this.getUserAppByIdHandler = this.getUserAppByIdHandler.bind(this);
        this.getUsersAppByUsernameHandler = this.getUsersAppByUsernameHandler.bind(this);
    }
    
    async postUserAppHandler(request, h) {
        try {
            this._validator.validateUserAppPayload(request.payload);
            const { username, password, fullname } = request.payload;
            
            const userId = await this._usersAppService.addUserApp({ username, password, fullname });
            
            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId,
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

    async getUserAppByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const user = await this._usersAppService.getUserAppById(id);
            return {
                status: 'success',
                data: {
                    user,
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

    async getUsersAppByUsernameHandler(request, h) {
        try {
            const { username = '' } = request.query;
            const users = await this._service.getUsersAppByUsername(username);
            return {
                status: 'success',
                data: {
                    users,
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
}

module.exports = UsersAppHandler;
