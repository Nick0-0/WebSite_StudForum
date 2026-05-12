const express = require('express');
const router = express.Router();
const forumController = require('../3controllers/forumController');
const documentController = require('../3controllers/documentController');
const calendarController = require('../3controllers/calendarController');

//Forum API
router.get('/topics/search', forumController.renderForum);
router.get('topic/:id/comments', forumController.getTopicDetails);
router.post('/comment', forumController.addComment);

//Document API
// router.get('documents/search', async (req, res) => {
//     //logic of searching
// });
router.get('/my-documents', documentController.getMyDocuments);

//Calendar API
router.get('/pending-events', calendarController.getPendingEventsJSON);
router.get('/calendar/events', calendarController.renderCalendar);

//Profile API
router.get('/my-notes', async (req, res) => {
    const Note = require('../4models/Note');
    try {
        const notes = await Note.getByStudentId(req.session.userId);
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: 'Loading notes error'});
    }
});

module.exports = router;