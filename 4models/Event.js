const db = require("../db");

class Event {
    static async create(name, startDate, endDate, description) {
        const sql = `
        INSERT INTO Events (name, start_date, end_date, description)
        VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [name, startDate, endDate, description], function(err) {
                if (err) return reject(err);
                resolve({id: this.lastID});
            });
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Events ORDER BY start_date ASC', [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getByMonth(monthYear) {
        const sql = `SELECT * FROM Events WHERE start_date LIKE ?`;
        return new Promise((resolve, reject) => {
            db.all(sql, [`%${monthYear}%`], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM Events WHERE id = ?', [id], (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }
}

module.exports = Event;