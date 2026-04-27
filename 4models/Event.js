const { Database } = require("sqlite3");

class Event {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.date = data.date;
        this.description = data.description;
        this.userId = data.userId;
    }

    static async create(eventData) {
        const db = new Database();
        const result = await db.query(
            'INSERT INTO events (title, date, description, userId) VALUE (?, ?, ?, ?)',
            [eventData.title, eventData.date, eventData.description, eventData.userId]
        );
        return result.insertId;
    }

    static async getAll() {
        const db = new Database();
        const results = await db.query('SELECT * FROM events');
        return results;
    }
}

modules.exports = Event;