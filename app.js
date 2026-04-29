//import necessary modules
const express = require('express'); //main framework for develop web-project
const logger = require('morgan'); //module for logging HTTP-requests
const cors = require('cors'); //module for COR-requests proccessing
const dotenv = require('dotenv'); //module for working with enviroment vars from .env
const db = require('./db'); //connect to DB with local module

//app initialization
const app = express(); //creating an instance of Express-app
const port = process.env.PORT || 3000; //defining the server launch port

//setting of enviroment vars
dotenv.config(); //loading of vars form .env to process.env

//middlewares for data parsing
app.use(cors());
app.use(express.json()); //parse input JSON to JS-object (req.body)
app.use(express.urlencoded({extended: true})); // parse input data form HTML-forms to object

//setting of logging
app.use(logger('dev')); //connecting of middleware logging in develop mode

//Settings EJS
app.set('view engine', 'ejs'); //set EJS as default template engine
app.set('views', './2views'); //route to dir with EJS-templates

//Static files
app.use(express.static('1public')); // set route to static files

//Connecting routes
const indexRouter = require('./5routes/index'); //import of main router
app.use('/', indexRouter); //connecting routes from indexRouter to root path

//exceptions catching
app.use((err, req, res, next) => { //the global error handler
    console.error('Error: ', err.stack); //write error to console
    res.status(500).json({ //sending an error response
        message: 'An internal server error has occured',
        error: err.message
    });
});

// additional processing of routes not found
app.use((req, res) => {
    res.status(404).send("Page not found");
});

//connecting to DB
db.connect() //connecting to DB
    .then(() => {
        //server start
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    })
    .catch((error) => { //in the error case
        console.log('Error of connect to the DB: ', error);
        process.exit(1); //ending the process with an error code
    });


//in the shutdown case
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});