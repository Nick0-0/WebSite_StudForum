const sqlite3 = require('sqlite3').verbose(); //Connecting the SQLite library with detailed logging
const path = require('path'); //module for working with file routes
const {DB_PATH = "DataBase.db"} = process.env; //using the enviroment vars

// Connect to DB Function
const connectToDataBase = () => {
    return new Promise((resolve, reject) => { //returning the promise to async working
        const db = new sqlite3.Database(path.join(__dirname, DB_PATH), //creating a secure path to BD file
            (err) => {
                if (err) {
                    console.error('Failed to connect to the DataBase:', err.message); //error logging
                    return reject(err); //rejection of promise in error case
                }
                console.log('Sucessful connect to the DataBase'); //infoming about sucessful connect
                resolve(db); //resolution of promise with connecting object
            }
        );
    });
};

//export object with methods
module.exports = {
    async connect() { //async connection method
        try {
            this.db = await connectToDataBase(); //waiting of connection
            return this.db; //returning connected object
        } catch (error) {
            throw new Error('Failed to connect to the DB', error); //creating error in error case
        }
    },
    close() { //closing connect method
        if (this.db) {
            this.db.close(() => {
                console.log('DB closed'); //informing about closing
            });
        }
    }
};