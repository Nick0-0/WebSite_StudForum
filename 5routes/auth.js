const express = require('express');
const router = express.Router();
const userController = require('../3controllers/userController');

router.get('/', userController.renderAuth);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;