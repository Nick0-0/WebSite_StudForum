const {Database} = require('../db');

class BaseUser {
    constructor(data) {
        this.id = data.id;
        this.login = data.login;
        this.password = data.password;
        this.role = data.role || 'user';
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

    async findById(id) {
        try {
            const result = await db.query('SELECT * FROM Students WHERE id = ?', [id]);
            return result.length > 0 ? new Student(result[0]) : null;
        } catch(error) {
            throw new Error('Get student error', {cause: error});
        }
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
                    this.course,
                    this.faculty,
                    this.groupNumber,
                    this.photo,
                    this.description
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
}

module.exports = {
    Student, Admin
};