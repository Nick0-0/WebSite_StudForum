//admins routes
const router = require('express').Router();
const userController = require('../3controllers/userController');
const calendarController = require('../3controllers/calendarController');
const forumController = require('../3controllers/forumController');

//user management section
router.get('/users', userController.getAdminUsers);
router.post('/users', userController.createAdminUser);
router.put('/users/:id', userController.updateAdminUser);
router.delete('/users/:id', userController.deleteAdminUser);

//events management section
router.get('/events', calendarController.getAdminEvents);
router.post('/events', calendarController.createAdminEvent);
router.put('/events/:id', calendarController.updateAdminEvent);
router.delete('/events/:id', calendarController.deleteAdminEvent);

//forum management section
router.get('/admin/topics', forumController.getAdminTopics);
router.put('/topics/:id', forumController.updateTopic);
router.delete('/topics/:id', forumController.deleteTopic);

router.get('/comments', forumController.getAdminComments);
router.delete('/comments/:id', forumController.deleteComment);

//export router for app using
module.exports = router;