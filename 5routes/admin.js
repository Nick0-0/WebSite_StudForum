//admins routes
const router = require('express').Router();
const userController = require('../3controllers/userController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

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
router.get('/events', calendarController.getEvents);
//creating new event
router.post('/events', calendarController.createEvent);
//updating event by id
router.put('/events/:id', calendarController.updateEvent);
//deleting event by id
router.delete('/events/:id', calendarController.deleteEvent);

//getting all topics list
router.get('/topics', forumController.getTopics);
//deleting topic by id
router.delete('/topics/:id', forumController.deleteTopic);


//export router for app using
module.exports = router;