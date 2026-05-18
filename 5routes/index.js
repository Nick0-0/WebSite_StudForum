const express = require('express');
const router = express.Router();
const forumController = require('../3controllers/forumController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');
const userController = require('../3controllers/userController');
const multer = require('multer');
const upload = multer();
const News = require('../4models/News');

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
router.get('/', async (req, res) => {
    try {
        const newsList = await News.getAll();
        res.render('index', {newsList});
    } catch (error) {
        res.render('index', {newsList: []});
    }
});

//forum page
router.get('/forum', isAuth, forumController.renderForum);
router.post('/forum/topic', isAuth, forumController.createTopic);
router.post('/forum/report', isAuth, forumController.reportForumItem);

//documents page
router.get('/document', isAuth, documentController.renderDocuments);
router.post('/document/report', isAuth, documentController.reportDocument);
router.post('/document/upload', isAuth, uploadDisk.single('doc'), documentController.uploadDocument);
router.get('/document/download/:id', isAuth, documentController.downloadDocument);
router.delete('/document/delete/:id', isAuth, documentController.deleteDocument);

//calendar
router.get('/calendar', isAuth, calendarController.renderCalendar);
router.post('/calendar/suggest', isAuth, calendarController.suggestEvent);

//profile
router.get('/profile', isAuth, userController.getProfile);
router.post('/profile/update', isAuth, upload.single('photo'), userController.updateProfile);
router.post('/profile/note', isAuth, userController.createNote);
router.delete('/profile/note/:id', isAuth, userController.deleteNote);

module.exports = router;