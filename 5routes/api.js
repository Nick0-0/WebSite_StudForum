const router = require('express').Router();
const userController = require('../3controllers/userController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

//CRUD operations with Users
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUser);
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
router.post('/events', calendarController.createEvent);
router.get('/events/:id', calendarController.getEventById);
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

//CRUD operations with forum
router.get('/topics', forumController.getAllTopics);
router.post('/topics', forumController.createPost);
router.get('/comments', forumController.getCommentsByTopic);
router.post('/comments', forumController.createComment);


module.exports = router;