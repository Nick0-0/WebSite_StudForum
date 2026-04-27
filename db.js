const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./DataBase.db', (err) => {
    if (err) {
        console.log('Failed to connect to the database:', err.message);
    }
    console.log('Connected to the database.');
});

module.exports = db;