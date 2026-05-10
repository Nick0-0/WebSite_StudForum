const {Database} = require('../db');

class Document {
    constructor(data) {
        this.id = data.id;
        this.typeOfDocument = data.typeOfDocument;
        this.studentId = data.studentId;
        this.doc = data.doc;
    }

    async create() {
        try {
            const result = await db.run(`
                INSERT INTO Documents (
                type_of_document,
                student_id,
                doc
                ) VALUES (?, ?, ?)
                `, [
                    this.typeOfDocument,
                    this.studentId,
                    this.doc
                ]);
                this.id = result.lastID;
                return this;
        } catch (error) {
            throw new Error('Create document error', {cause: error});
        }
    }

    static async createFromData(data) {
        const doc = new Document(data);
        return doc.create();
    }

    static async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Documents WHERE id = ?', [id]);
            return result.length > 0 ? new Document(result[0]) : null;
        } catch (error) {
            throw new Error('Find doc by id error', {cause: error});
        }
    }

    static async findByStudentId(studentId) {
        try {
            const results = await db.query('SELECT * FROM Documents WHERE student_id = ?', [studentId]);
            return results.map(row => new Document(row));
        } catch (error) {
            throw new Error('Find doc by student id error', {cause: error});
        }
    }

    async update() {
        try {
            await db.run(`
                UPDATE Documents SET
                type_of_document = ?,
                student_id = ?,
                doc = ?
                WHERE id = ?
                `, [
                    this.typeOfDocument,
                    this.studentId,
                    this.doc,
                    this.id
                ]);
                return this;
        } catch (error) {
            throw new Error('Update doc error', {cause: error});
        }
    }

    async delete() {
        try {
            await db.run('DELETE FROM Documents WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Delete doc error', {cause: error});
        }
    }

    toObject() {
        return {
            id: this.id,
            typeOfDocument: this.typeOfDocument,
            studentId: this.studentId,
            doc: this.doc
        };
    }
}

module.exports = Document;