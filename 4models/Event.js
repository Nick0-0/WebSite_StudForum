const { Database } = require("../db");

class Event {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.description = data.description;
    }

    static async create(eventData) {
        try {
            const result = await db.run(`
                INSERT INTO Events (
                name, start_date, end_date,
                description
                ) VALUES (?, ?, ?, ?)
                `, [
                    this.name,
                    this.start_date,
                    this.end_date,
                    this.description
                ]);
                this.id = result.lastID;
                return this;
        } catch (error) {
            throw new Error('Create event error', {cause: error});
        }
    }

    static async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Events WHERE id = ?', [id]);
            return result.length > 0 ? new Event(result[0]) : null;
        } catch (error) {
            throw new Error('Find event by id error', {cause: error});
        }
    }

    static async findAll() {
        try {
            const results = await db.query('SELECT * FROM Events');
            return results.map(row => new Event(row));
        } catch (error) {
            throw new Error('Find events list error', {cause: error});
        }
    }

    async update() {
        try {
            await db.run(`
                UPDATE Events SET
                    name = ?,
                    start_date = ?,
                    end_date = ?,
                    description = ?
                WHERE id = ?
            `, [
                this.name,
                this.start_date,
                this.end_date,
                this.description,
                this.id
            ]);
            return this;
        } catch (error) {
            throw new Error('Update event error', {cause: error});
        }
    }

    async delete() {
        try {
            await db.run('DELETE FROM Events WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Delete event error', {cause: error});
        }
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            start_date: this.start_date,
            end_date: this.end_date,
            description: this.description
        };
    }
}

modules.exports = Event;