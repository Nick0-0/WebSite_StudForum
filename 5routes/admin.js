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
router.post('/approve-event', calendarController.approveEvent);
router.post('/delete-event/:id', calendarController.deleteEvent);

//publication news (for latest versions and future)
router.post('/post-news', (req, res) => {
    //logic of publication
    res.send('News has published');
});

module.exports = router;