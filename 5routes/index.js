//main routes
const express = require('express');
const router = express.Router();

//include main routers
const authRouter = require('./auth');
const apiRouter = require('./api');
const adminRouter = require('./admin');

//basic routes
router.use('/auth', authRouter); //router for autheticate
router.use('/api', apiRouter);  //router for API requests
router.use('/admin', adminRouter);

//Routes
router.get('/', (req, res) => {
    res.render('layout');
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

//final error handler
router.use ((error, req, res, next) => {
    res.status(error.statuc || 500);
    res.json({error: {message: error.message}});
});

module.exports = router;