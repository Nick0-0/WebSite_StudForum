//admins routes
const router = require('express').Router();
const userController = require('../3controllers/userController');

//user management section
//getting all users list
router.get('/users', userController.getUsers);
//getting info about user by id
router.get('/users', userController.getUserById);
//updating info about user
router.put('/users/:id', userController.updateUser);
//deleting user
router.delete('/users/:id', userController.deleteUser);

//documents management section
//getting all docs list
router.get('/documents', userController.getDocuments);
//deleting doc by id
router.delete('/documents/:id', userController.deleteDocument);

//events management section
//getting all events list
router.get('/events', userController.getEvents);
//creating new event
router.post('/events', userController.createEvent);
//updating event by id
router.put('/events/:id', userController.updateEvent);
//deleting event by id
router.delete('/events/:id', userController.deleteEvent);

//getting all topics list
router.get('/topics', userController.getTopics);
//deleting topic by id
router.delete('/topics/:id', userController.deleteTopic);

//middleware for error handler
router.use((req, res, next) => {
    const error = new Error('Invalid route');
    error.status = 404;
    next(error);
});

//export router for app using
module.exports = router;