const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

//Settings EJS
app.set('view engine', 'ejs');
app.set('views', './2views');

//Static files
app.use(express.static('1public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Including routes
const indexRouter = require('./5routes/index');
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});