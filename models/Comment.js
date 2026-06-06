const db = require('../db');//connect to the DB

class Comment {
    static async create(topicId, userType, userId, description) {
        const sql = `
        INSERT INTO Comments (topic_id, type_of_user, user_id, description)
        VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [topicId, userType, userId, description],
                function(err) {
                    if (err) reject(err);
                    resolve({id: this.lastID});
                }
            );
        });
    }

    static async getByTopic(topicId) {
        const sql = `
        SELECT
            c.*,
            CASE
                WHEN c.type_of_user = 'student' THEN s.first_name || ' ' || s.last_name
                WHEN c.type_of_user = 'admin' THEN a.first_name || ' ' || a.last_name
            END as author_name,
            CASE
                WHEN c.type_of_user = 'student' THEN s.photo
                WHEN c.type_of_user = 'admin' THEN a.photo
            END as autor_photo
        FROM Comments c
        LEFT JOIN Students s ON c.user_id = s.id AND c.type_of_user = 'student'
        LEFT JOIN Admins a ON c.user_id = a.id AND c.type_of_user = 'admin'
        WHERE c.topic_id = ?
        ORDER BY c.id DESC
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [topicId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async delete(commentId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM Comments WHERE id = ?', [commentId], (err) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    }
}

module.exports = Comment;