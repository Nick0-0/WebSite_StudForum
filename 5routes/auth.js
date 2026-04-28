//routes of authentication
const router = require('express').Router();
const userController = require('../3controllers/userController');

//routes of register, login and logout
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);


//404 error handler
router.use((req, res, next) => {
    const error = new Error('Invalid route');
    error.status = 404;
    next(error);
});

module.exports = router;