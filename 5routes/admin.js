// admins routes
const router = require('express').Router();
const userController = require('../3controllers/userController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

// user management section
router.get('/users', userController.getAllUsers); 
router.post('/users', userController.register);  
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// events management section
router.get('/events', calendarController.getAllEvents); 
router.post('/events', calendarController.createEvent);
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

// forum management section
router.get('/topics', forumController.getAllTopics);
router.post('/topics', forumController.createPost);
router.put('/topics/:id', forumController.updateTopic);
router.delete('/topics/:id', forumController.deletePost);

router.get('/comments', forumController.getCommentsByTopic);
router.delete('/comments/:id', forumController.deleteComment);

// export router for app using
module.exports = router;