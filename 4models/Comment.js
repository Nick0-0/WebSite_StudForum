const {Database} = require('../db');

class Comment {
    constructor(data) {
        this.id = data.id;
        this.topicId = data.topic_id;
        this.typeOfUser = data.type_of_user;
        this.userId = data.user_id;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    async create(commentData) {
        try {
            const result = await db.run(`
                INSERT INTO Comments (
                    topic_id,
                    type_of_user,
                    user_id,
                    description
                ) VALUES (?, ?, ?, ?)
                `, [
                    this.topicId,
                    this.typeOfUser,
                    this.userId,
                    this.description
                ]);
                this.id = result.lastID;
                return this;
        } catch (error) {
            throw new Error('Create comment error', {cause: error});
        }
    }

    static async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Comments WHERE id = ?', [id]);
            return result.length > 0 ? new Comment(result[0]) : null;
        } catch (error) {
            throw new Error('Get comment by id error', {cause: error});
        }
    }

    static async findAll() {
        try {
            const results = await db.query('SELECT * FROM Comments');
            return results.map(row => new Comment(row));
        } catch (error) {
            throw new Error('Get all comments list error', {cause: error});
        }
    }

    async update(updatedData) {
        try {
            await db.run(`
                UPDATE Comments SET
                    topic_id = ?,
                    type_of_user = ?,
                    user_id = ?,
                    description = ?
                WHERE id = ?
                `, [
                    updatedData.topicId || this.topicId,
                    updatedData.typeOfUser || this.typeOfUser,
                    updatedData.userId || this.userId,
                    updatedData.description || this.description,
                    this.id
                ]);
            return this;
        } catch (error) {
            throw new Error('Update comment error', {cause: error});
        }
    }

    async delete() {
        try {
            await db.run('DELETE FROM Comments WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Delete comment error', {cause: error});
        }
    }

    toObject() {
        return {
            id: this.id,
            topicId: this.topicId,
            typeOfUser: this.typeOfUser,
            userId: this.userId,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Comment;