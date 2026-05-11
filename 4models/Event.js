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

    static async suggest(data, userId) {
        const sql = `
        INSERT INTO Journal (table_name, record_id, action_type, new_data,
        type_of_user, user_id)
        VALUES ('Events', 0, 'insert', ?, 'student', ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [JSON.stringify(data), userId], (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }

    static async getPending() {
        const sql = `
        SELECT * FROM Journal WHERE table_name = 'Events' AND action_type = 'insert'
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                const parsed = rows.map(row => ({
                    journal_id: row.id,
                    ...JSON.parse(row.new_data),
                    user_id: row.user_id
                }));
                resolve(parsed);
            });
        });
    }

    static async deleteJournalEntry(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM Journal WHERE id = ?', [id], (err) => {
                if (err) return reject(err);
                resolve(true);
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