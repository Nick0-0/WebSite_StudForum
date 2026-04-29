const {Database} = require('../db');

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.role = data.role || 'user';
    }

    static async create(user) {
        //logic of user creation
        const db = new Database();
        const result = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [user.username, user.password, user.role]
        );
        return result.insertId;
    }

    static async getByID(id) {
        //Search user by ID
        const db = new Database();
        const result = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
    }
}

module.exports = User;