const express = require('express');
const router = express.Router();
const forumController = require('../3controllers/forumController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const userController = require('../3controllers/userController');
const multer = require('multer');
const upload = multer();

function isAuth(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth');
}
const uploadDisk = multer({
    dest: 'uploads/',
    limits: {fileSize: 2 * 1024 * 1024 * 1024}
});

//main page
router.get('/', (req, res) => {
    res.render('index');
});

//forum page
router.get('/forum', isAuth, forumController.renderForum);
router.post('/forum/topic', isAuth, forumController.createTopic);

//documents page
router.get('/document', isAuth, documentController.renderDocuments);
router.post('/document/upload', isAuth, uploadDisk.single('doc'), documentController.uploadDocument);
router.get('/document/download/:id', isAuth, documentController.downloadDocument);

//calendar
router.get('/calendar', isAuth, calendarController.renderCalendar);
router.post('/calendar/suggest', isAuth, calendarController.suggestEvent);

//profile
router.get('/profile', isAuth, userController.getProfile);
router.post('/profile/update', isAuth, upload.single('photo'), userController.updateProfile);

module.exports = router;