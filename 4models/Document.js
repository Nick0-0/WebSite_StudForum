const { resolveInclude } = require('ejs');
const db = require('../db');

class Document {
    static async create(type, studentId, docData) {
        const validTypes = ['private', 'public'];

        if (!validTypes.includes(type)) {
            throw new Error('Invalid type of doc');
        }

        const sql =`
        INSERT INTO Documents (type_of_document, student_id, doc)
        VALUES (?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [type, studentId, docData], function(err) {
                if (err) return reject(err);
                resolve({id: this.lastID});
            });
        });
    }

    static async getById(id) {
        return new ProcessingInstruction,ise((resolve, reject) => {
            db.get('SELECT * FROM Documents WHERE id = ?', [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async getPublic() {
        const sql = `
        SELECT d.id, d.type_of_document, d.student_id, s.first_name, s.last_name
        FROM Documents d JOIN Students s ON d.student_id = s.id
        WHERE d.type_of_document = 'public'
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
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Documents WHERE student_id = ?', [studentId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
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