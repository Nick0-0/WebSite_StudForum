const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

//parsers
app.use(express.json()); //parse input JSON to JS-object (req.body)
app.use(express.urlencoded({extended: true})); // parse input data form HTML-forms to object

//Including routes
const indexRouter = require('./5routes/index');
app.use('/', indexRouter);

//Static files
app.use(express.static('1public')); // set route to static files

//Settings EJS
app.set('view engine', 'ejs');
app.set('views', './2views');

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});