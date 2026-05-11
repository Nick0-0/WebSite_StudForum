
// admins routes
const router = require('express').Router();
const userController = require('../3controllers/userController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

// user management section
router.get('/users', userController.getAllUsers); 
router.post('/users', userController.createUser);  
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// events management section
router.get('/events', calendarController.getAllEvents); 
router.post('/events', calendarController.createCalendarEvent);
router.put('/events/:id', calendarController.updateCalendarEvent);
router.delete('/events/:id', calendarController.deleteCalendarEvent);

// forum management section
router.get('/topics', forumController.getTopics);
router.post('/topics', forumController.createTopic);
router.put('/topics/:id', forumController.updateTopic);
router.delete('/topics/:id', forumController.deleteTopic);

router.get('/comments', forumController.getComments);
router.delete('/comments/:id', forumController.deleteComment);

// export router for app using
module.exports = router;