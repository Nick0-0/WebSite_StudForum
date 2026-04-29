//admins routes
const router = require('express').Router();
const userController = require('../3controllers/userController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

//user management section
//getting all users list
router.get('/admin/users', userController.getUsers);
//getting info about user by id
router.get('/admin/users', userController.getUserById);
//updating info about user
router.put('/admin/users/:id', userController.updateUser);
//deleting user
router.delete('/admin/users/:id', userController.deleteUser);

//documents management section
//getting all docs list
router.get('/admin/documents', userController.getDocuments);
//deleting doc by id
router.delete('/admin/documents/:id', userController.deleteDocument);

//events management section
//getting all events list
router.get('/admin/events', calendarController.getEvents);
//creating new event
router.post('/admin/events', calendarController.createEvent);
//updating event by id
router.put('/admin/events/:id', calendarController.updateEvent);
//deleting event by id
router.delete('/admin/events/:id', calendarController.deleteEvent);

//getting all topics list
router.get('/admin/topics', forumController.getTopics);
//deleting topic by id
router.delete('/admin/topics/:id', forumController.deleteTopic);


//export router for app using
module.exports = router;