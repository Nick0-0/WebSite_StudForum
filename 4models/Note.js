const {Database} = require('../db');

class Note {
    constructor(data) {
        this.id = data.id;
        this.studentId = data.studentId;
        this.description = data.description;
    }

    async create() {
        try {
            const result = await db.run(`
                INSERT INTO Notes (
                student_id,
                description
                ) VALUES (?, ?)
                `, [
                    this.student_id,
                    this.description
                ]);
            this.id = result.lastID;
            return this;
        } catch (error) {
            throw new Error('Create note error', {cause: error});
        }
    }
}