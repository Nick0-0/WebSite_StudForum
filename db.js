const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const {DB_PATH = "DataBase.db"} = process.env;

let dbInstance = null;

console.log('Start of connect');

function connectToDataBase(callback) {
    console.log('Start connecting to database');

    const db = new sqlite3.Database(
        path.join(__dirname, DB_PATH),
        {
            readonly: false
        },
        (err) => {
            if (err) {
                console.error('Connect to the DB error:', err.message);
                return callback(err);
            }
            console.log('Successful connect to the DB');
            dbInstance = db;
            callback(null, db);
        }
    );
}

module.exports = {
    connect(callback) {
        if (dbInstance) {
            return callback(null, dbInstance);
        }
        connectToDatabase(callback);
    },
    
    close(callback) {
        if (!dbInstance) return callback(new Error('DB not connected'));
        
        dbInstance.close((err) => {
            if (err) {
                return callback(err);
            }
            console.log('DB closed');
            dbInstance = null;
            callback(null);
        });
    },
    
    query(sql, params, callback) {
        if (!dbInstance) return callback(new Error('DB not connected'));
        
        dbInstance.all(sql, params, (err, rows) => {
            if (err) {
                return callback(new Error('Request execution error: ' + err.message));
            }
            callback(null, rows);
        });
    },
    
    run(sql, params, callback) {
        if (!dbInstance) return callback(new Error('DB not connected'));
        
        dbInstance.run(sql, params, (err) => {
            if (err) {
                return callback(err);
            }
            callback(null, dbInstance.lastID);
        });
    },
    
    each(sql, params, callback, resultCallback) {
        if (!dbInstance) return callback(new Error('DB not connected'));
        
        dbInstance.each(sql, params, (err, row) => {
            if (err) {
                return callback(err);
            }
            resultCallback(row);
        }, callback);
    },
    
    prepare(sql, params, callback) {
        if (!dbInstance) return callback(new Error('DB not connected'));
        
        dbInstance.prepare(sql, params, (err, stmt) => {
            if (err) {
                return callback(err);
            }
            callback(null, stmt);
        });
    }
};
