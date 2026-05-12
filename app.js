const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

//setting of templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//--Middleware--
app.use(express.static(path.join(__dirname, '1public')));
app.use(bodyParser.urlencoded({extended: true, limit: '2gb'}));
app.use(bodyParser.json({limit: '2gb'}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, //session'a live is 24 hours
        secure: false //true in case HTTPS only
    }
}));

//transmitting session data
app.use((req, res, next) => {
    if (res.session) {
        res.locals.user = req.session.userId || null;
        res.locals.role = req.session.role || null;
    } else {
        res.locals.user = null;
        res.locals.role = null;
    }
    next();
});

//including the routes
const indexRoutes = require('./5routes/index');
const authRoutes = require('./5routes/auth');
const adminRoutes = require('./5routes/admin');
const apiRoutes = require('./5routes/api');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

//error handler
app.use((req, res) => {
    res.status(404).render('index', {error: 'Page not found'});
});

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});