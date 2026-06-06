const db = require('../db');

class Document {
    static async create(studentId, fileData, typeOfDocument, topicId) {
        const finalTopicId = topicId === '' || topicId === undefined ? null : topicId;

        const sql =`
        INSERT INTO Documents (student_id, doc, type_of_document, topic_id)
        VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [studentId, fileData, typeOfDocument, finalTopicId], function(err) {
                if (err) return reject(err);
                resolve({id: this.lastID});
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM Documents WHERE id = ?', [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async getPublic() {
        const sql = `
        SELECT d.id, d.type_of_document, d.student_id, s.first_name, s.last_name, t.name AS topic_name
        FROM Documents d JOIN Students s ON d.student_id = s.id
        LEFT JOIN Topics t ON d.topic_id = t.id
        WHERE d.type_of_document LIKE 'public:%'
        ORDER BY d.id DESC
        `;

        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getByStudentId(studentId) {
        const sql = `
            SELECT d.id, d.type_of_document, d.topic_id, t.name as topic_name
            FROM Documents d
            LEFT JOIN Topics t ON d.topic_id = t.id
            WHERE d.student_id = ?
            ORDER BY d.id DESC
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [studentId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM Documents WHERE id = ?', [id], (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }
}

module.exports = Document;