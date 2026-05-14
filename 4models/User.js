const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    static async findByLogin(login) {
        const student = await new Promise((resolve) => {
            db.get('SELECT *, "student" as role FROM Students WHERE login = ?', 
                [login], (err, row) => resolve(row));
        });
        if (student) return student;

        const admin = await new Promise((resolve) => {
            db.get('SELECT *, "admin" as role FROM Admins WHERE login = ?', 
                [login], (err, row) => resolve(row));
        });
        return admin || null;
    }

    static async createStudent(data) {
        const {login, first_name, last_name, email, phone_number,
             course, faculty, group_number, password} = data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO Students (login, first_name, last_name, email, phone_number,
             course, faculty, group_number, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [login, first_name, last_name, email, phone_number,
             course, faculty, group_number, hashedPassword], function(err) {
                if (err) return reject(err);
                resolve({id: this.lastID});
             });
        });
    }

    static async updateProfile(id, role, updateData) {
        const table = role === 'admin' ? 'Admins' : 'Students';
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];

        const sql = `UPDATE ${table} SET ${fields} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, values, function(err) {
                if (err) return reject(err);
                resolve({changes: this.changes});
            });
        });
    }

    static async getById(id, role) {
        const table = role === 'admin' ? 'Admins' : 'Students';

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                if (row) delete row.password;
                resolve(row);
            });
        });
    }
}

module.exports = User;