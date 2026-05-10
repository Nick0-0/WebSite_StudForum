const {Database} = require('../db');
const bcrypt = require('bcrypt');

class BaseUser {
    constructor(data) {
        this.id = data.id;
        this.login = data.login;
        this.password = data.password;
        this.email = data.email;
    }

    async authenticate(password) {
        return bcrypt.compare(password, this.password);
    }
}

class Student extends BaseUser {
    constructor(data) {
        super(data);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.course = data.course;
        this.faculty = data.faculty;
        this.groupNumber = data.groupNumber;
        this.photo = data.photo;
        this.description = data.description;
    }

    async create(user) {
        try {
            const result = await db.run(`
                INSERT INTO Students (
                login,
                password,
                first_name,
                last_name,
                email,
                course,
                faculty,
                group_number,
                photo,
                description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    this.login,
                    this.password,
                    this.firstName,
                    this.lastName,
                    this.email,
                    this.course,
                    this.faculty,
                    this.groupNumber,
                    this.photo,
                    this.description
                ]);
                this.id = result.lastID;
                return this;
        } catch(error) {
            throw new Error('Create student error', {cause: error});
        }
    }

    static async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Students WHERE id = ?', [id]);
            return result.length > 0 ? new Student(result[0]) : null;
        } catch(error) {
            throw new Error('Get student by id error', {cause: error});
        }
    }

    static async findByLogin(login) {
        try {
            const result = await db.query('SELECT * FROM Students WHERE login = ?', [login]);
            return result.length > 0 ? new Student(result[0]) : null;
        } catch (error) {
            throw new Error('Get student by login error', {cause: error});
        }
    }

    static async findByEmail(email) {
        try {
            const result = await db.query('SELECT * FROM Students WHERE email = ?', [email]);
            return result.length > 0 ? new Student(result[0]) : null;
        } catch (error) {
            throw new Error('Get student by email error', {cause: error});
        }
    }

    static async find() {
        try {
            const results = await db.query('SELECT * FROM Students');
            return results.map(row => new Student(row));
        } catch (error) {
            throw new Error('General Get student error', {cause: error});
        }
    }

    async update() {
        try {
            await db.run(`
                UPDATE Students SET
                    login = ?,
                    password = ?,
                    email = ?,
                    first_name = ?,
                    last_name = ?,
                    course = ?,
                    faculty = ?,
                    group_number = ?,
                    photo = ?,
                    description = ?
                WHERE id = ?
                `, [
                    this.login,
                    this.password,
                    this.email,
                    this.firstName,
                    this.lastName,
                    this.course,
                    this.faculty,
                    this.groupNumber,
                    this.photo,
                    this.description,
                    this. id
                ]);
                return this;
        } catch (error) {
            throw new Error('Update student error', {cause: error});
        }
    }

    async delete() {
        try {
            await db.run('DELETE FROM Students WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Delete user error', {cause: error});
        }
    }

    toObject() {
        return {
            id: this.id,
            login: this.login,
            // role: this.role,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            course: this.course,
            faculty: this.faculty,
            groupNumber: this.groupNumber,
            photo: this.photo,
            description: this.description
        };
    }
}

class Admin extends BaseUser {
    constructor(data) {
        super(data);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.photo = data.photo;
    }

    async create(user) {
        try {
            const result = await db.run(`
                INSERT INTO Admins (
                login,
                password,
                first_name,
                last_name,
                email,
                photo
                ) VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    this.login,
                    this.password,
                    this.firstName,
                    this.lastName,
                    this.email,
                    this.photo
                ]);
                this.id = result.lastID;
                return this;
        } catch(error) {
            throw new Error('Create admin error', {cause: error});
        }
    }

    async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Admins WHERE id = ?', [id]);
            return result.length > 0 ? new Admin(result[0]) : null;
        } catch(error) {
            throw new Error('Get admin error', {cause: error});
        }
    }

    //!!!PAUSED HERE!!!
    static async findByLogin(login) {
        try {
            const result = await db.query('SELECT * FROM Admins WHERE login = ?', [login]);
            return result.length > 0 ? new Admin(result[0]) : null;
        } catch (error) {
            throw new Error('Get admin by login error', {cause: error});
        }
    }

    static async findByEmail(email) {
        try {
            const result = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
            return result.length > 0 ? new Admin(result[0]) : null;
        } catch (error) {
            throw new Error('Get admin by email error', {cause: error});
        }
    }

    static async find() {
        try {
            const results = await db.query('SELECT * FROM Admins');
            return results.map(row => new Admin(row));
        } catch (error) {
            throw new Error('General Get admin error', {cause: error});
        }
    }

    async update() {
        try {
            await db.run(`
                UPDATE Admins SET
                    login = ?,
                    password = ?,
                    email = ?,
                    first_name = ?,
                    last_name = ?,
                    photo = ?,
                WHERE id = ?
                `, [
                    this.login,
                    this.password,
                    this.email,
                    this.firstName,
                    this.lastName,
                    this.photo,
                    this.id
                ]);
                return this;
        } catch (error) {
            throw new Error('Update admin error', {cause: error});
        }
    }

    async delete() {
        try {
            await db.run('DELETE FROM Admins WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Delete admin error', {cause: error});
        }
    }

    toObject() {
        return {
            id: this.id,
            login: this.login,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            photo: this.photo
        };
    }
}

module.exports = {
    Student, Admin
};