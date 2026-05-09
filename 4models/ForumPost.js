const {Database} = require('../db');

class Topic {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.typeOfUser = data.type_of_user;
        this.userId = data.user_id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    async create(topicData) {
        try {
            const result = await db.run(`
                INSERT INTO Topics (
                    name,
                    type_of_user,
                    user_id
                ) VALUES (?, ?, ?)
                `, [
                    this.name,
                    this.typeOfUser,
                    this.userId
                ]);
                this.id = result.lastID;
                return this;
        } catch (error) {
            throw new Error('Create topic error', {cause: error});
        }
    }

    static async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Topics WHERE id = ?', [id]);
            return result.length > 0 ? new Topic(result[0]) : null;
        } catch (error) {
            throw new Error('Get topic error', {cause: error});
        }
    }

    static async findAll() {
        try {
            const results = await db.query('SELECT * FROM Topics');
            return results.map(row => new Topic(row));
        } catch (error) {
            throw new Error('Gett all topics list error', {cause: error});
        }
    }

    async update(updatedData) {
        try {
            await db.run(`
                UPDATE Topics SET
                    name = ?,
                    type_of_user = ?,
                    user_id = ?
                WHERE id = ?
            `, [
                updatedData.name || this.name,
                updatedData.typeOfUser || this.typeOfUser,
                updatedData.userId || this.userId,
                this.id
            ]);
            return this;
        } catch (error) {
            throw new Error('Update topic error', {cause: error});
        }
    }

    async delete() {
        try {
            await db.run('DELETE FROM Topics WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Delete topic error', {cause: error});
        }
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            typeOfUser: this.typeOfUser,
            userId: this.userId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Topic;