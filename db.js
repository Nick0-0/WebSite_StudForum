const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = path.resolve(__dirname, process.env.DB_PATH || './DataBase.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Connect to the DB error', err.message);
    } else {
        console.log('Successful connected to the SQLite DB');

        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) console.error('Switch On foreign keys error');
        });
    }
});

module.exports = db;