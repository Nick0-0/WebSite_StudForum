const db = require('../db');

class Note {
    static async create(studentId, description) {
            const sql = `
            INSERT INTO Notes (student_id, description)
            VALUES (?, ?)
            `;
    
            return new Promise((resolve, reject) => {
                db.run(sql, [studentId, description], function(err) {
                    if (err) return reject(err);
                    resolve({id: this.lastID});
                });
            });
        }
    
        static async getByStudentId(studentId) {
            const sql = `SELECT * FROM Notes WHERE student_id = ? ORDER BY id DESC`;
            return new Promise((resolve, reject) => {
                db.all(sql, [studentId], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            });
        }
    
        static async update(id, studentId, newDescription) {
            const sql = `UPDATE Notes SET description = ? WHERE id = ? AND student_id = ?`;
            return new Promise((resolve, reject) => {
                db.run(sql, [newDescription, id, studentId], (err) => {
                    if (err) return reject(err);
                    resolve({changes: this.changes});
                });
            });
        }
    
        static async delete(id, studentId) {
            const sql = `DELETE FROM Notes WHERE id = ? AND student_id = ?`;
            return new Promise((resolve, reject) => {
                db.run(sql, [id, studentId], (err) => {
                    if (err) return reject(err);
                    resolve(true);
                });
            });
        }
}

module.exports = Note;