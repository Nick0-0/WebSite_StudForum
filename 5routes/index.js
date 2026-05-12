const express = require('express');
const router = express.Router();
const forumController = require('../3controllers/forumController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const userController = require('../3controllers/userController');

function isAuth(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth');
}

//main page
router.get('/', (req, res) => {
    res.render('index', {user: req.session.user, role: req.session.role});
});

//forum page
router.get('/forum', isAuth, forumController.renderForum);
router.post('/forum/topic', isAuth, forumController.createTopic);

//documents page
router.get('/document', isAuth, documentController.renderDocuments);
router.post('/doucment/upload', isAuth, documentController.uploadDocument);
router.get('/document/download/:id', isAuth, documentController.downloadDocument);

//calendar
router.get('/calendar', isAuth, calendarController.renderCalendar);
router.post('/calendar/suggest', isAuth, calendarController.suggestEvent);

//profile
router.get('/profile', isAuth, userController.getProfile);
router.post('/profile/update', isAuth, userController.updateProfile);

module.exports = router;