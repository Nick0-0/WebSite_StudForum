//main routes
const express = require('express');
const router = express.Router();

//middleware for authorization control
// const {isAuthenticated} = require('../')
//при добавлении проверки авторизации раскомментировать

//Routes
router.get('/', (req, res) => {
    res.render('layout');
});
router.get('/auth', (req, res) => {
    res.render('auth');
});
router.get('/calendar', (req, res) => {
    res.render('calendar');
});
router.get('/document', (req, res) => {
    res.render('document');
});
router.get('/forum', (req, res) => {
    res.render('forum');
});
router.get('/profile', (req, res) => {
    res.render('profile');
});

//adding error handler
router.use ((req, res, next) => {
    const error = new Error('Invalid route');
    error.status = 404;
    next(error);
});

module.exports = router;