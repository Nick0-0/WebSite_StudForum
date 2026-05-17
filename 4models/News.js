const db = require('../db');

class News {
    static async create(title, content, adminId) {
        const data = {title, content, date: new Date().toLocaleDateString('ru-RU')};
        const sql = `
            INSERT INTO Journal (table_name, record_id, action_type, new_data, type_of_user, user_id)
            VALUES ('News', 0, 'insert', ?, 'admin', ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [JSON.stringify(data), adminId], (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }

    static async getAll() {
        const sql = `SELECT * FROM Journal WHERE table_name = 'News' ORDER BY id DESC`;
        return new Promise((resole, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                const parsed = rows.map(row => ({
                    id: row.id,
                    ...JSON.parse(row.new_data)
                }));
                resole(parsed);
            });
        });
    }
}

module.exports = News;