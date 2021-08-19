const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantErrorApp = require('../../exceptions/InvariantErrorApp');
const NotFoundErrorApp = require('../../exceptions/NotFoundErrorApp');
const AuthenticationErrorApp = require('../../exceptions/AuthenticationErrorApp');

class UsersServiceApp {
    constructor() {
        this._pool = new Pool();
    }

    async addUserApp({ username, password, fullname }) {
        await this.verifyNewUsernameApp(username);
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantErrorApp('User tidak berhasil ditambahkan');
        }

        return result.rows[0].id;
    }

    async verifyNewUsernameApp(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };
        
        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantErrorApp('Tidak berhasil menambahkan user. Username telah dipakai.');
        }
    }

    async getUserAppById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };
        
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundErrorApp('User tidak berhasil ditemukan');
        }

        return result.rows[0];
    }

    async verifyUserAppCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };
        
        const result = await this._pool.query(query);
        
        if (!result.rowCount) {
            throw new AuthenticationErrorApp('Kredensial yang Anda berikan keliru');
        }
        
        const { id, password: hashedPassword } = result.rows[0];
        
        const match = await bcrypt.compare(password, hashedPassword);
        
        if (!match) {
            throw new AuthenticationErrorApp('Kredensial yang Anda berikan keliru');
        }
        
        return id;
    }

    async getUsersAppByUsername(username) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
            values: [`%${username}%`],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = UsersServiceApp;
