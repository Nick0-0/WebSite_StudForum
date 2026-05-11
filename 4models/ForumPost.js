const db = require('../db');

class Topic {
    static async create(name, userType, userId) {
        const sql = `
        INSERT INTO Topics (name, type_of_user, user_id)
        VALUES (?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [name, userType, userId], function(err) {
                if (err) return reject(err);
                resolve({id: this.lastID});
            });
        });
    }

    static async getAll() {
        const sql =`
        SELECT t.*,
            (SELECT COUNT(*) FROM Comments WHERE topic_id = t.id) as comments_count,
            CASE
                WHEN t.type_of_user = 'student' THEN s.first_name || ' ' || s.last_name
                WHEN t.type_of_user = 'admin' THEN a.first_name || ' ' || a.last_name
            END as author_name
        FROM Topics t
        LEFT JOIN Students s ON t.user_id = s.id AND t.type_of_user = 'student'
        LEFT JOIN Admins a ON t.user_id = a.id AND t.type_of_user = 'admin'
        ORDER BY t.id DESC
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async search(query) {
        const sql = `SELECT * FROM Topics WHERE name LIKE ? ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [`%${query}%`], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM Topics WHERE id = ?', [id], (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }
}

module.exports = Topic;