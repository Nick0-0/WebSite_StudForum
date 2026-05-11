const router = require('express').Router();
const userController = require('../3controllers/userController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

//CRUD operations with Users
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

//CRUD operations with documents
router.get('/documents', documentController.getUserDocuments);
router.post('/documents', documentController.createDocument);
router.get('/documents/:id', documentController.getDocumentById);
router.put('/documents/:id', documentController.updateDocument);
router.delete('/documents/:id', documentController.deleteDocument);

//CRUD operations with events
router.get('/events', calendarController.getAllEvents);
router.post('/events', calendarController.createCalendarEvent);
router.get('/events/:id', calendarController.getCalendarEventById);
router.put('/events/:id', calendarController.updateCalendarEvent);
router.delete('/events/:id', calendarController.deleteCalendarEvent);

//CRUD operations with forum
router.get('/topics', forumController.getTopics);
router.post('/topics', forumController.createTopic);
router.get('/comments', forumController.getComments);
router.post('/comments', forumController.createComment);


module.exports = router;