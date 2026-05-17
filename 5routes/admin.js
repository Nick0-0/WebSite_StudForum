const express = require('express');
const router = express.Router();
const forumController = require('../3controllers/forumController');
const calendarController = require('../3controllers/calendarController');

function isAdmin(req, res, next) {
    if (req.session.userId && req.session.role === 'admin') {
        return next();
    }
    res.status(403).send('Not access rights: need admin-role');
}

router.use(isAdmin);

//Forum management
router.delete('/topic/:id', forumController.deleteTopic);

//Calendar management
router.get('/pending-events', calendarController.renderPendingEvents);
router.post('/calendar/approve', calendarController.approveEvent);
router.delete('/calendar/reject/:id', calendarController.deleteEvent);

//publication news (for latest versions and future)
router.post('/post-news', isAdmin, async (req, res) => {
    try {
        const {title, content} = req.body;
        const adminId = req.session.userId;

        const News = require('../4models/News');
        await News.create(title, content, adminId);
        res.redirect('/profile');
    } catch (error) {
        console.error("CRITICAL CLASS NEWS ERROR:", error)
        res.status(500).send('Publication news error');
    }
});

module.exports = router;