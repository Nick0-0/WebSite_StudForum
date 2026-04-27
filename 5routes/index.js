const express = require('express');
const router = express.Router();

//Controllers Import
const userController = require('../3controllers/userController');

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

module.exports = router;