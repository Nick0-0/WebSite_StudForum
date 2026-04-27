const router = require('express').Router();
const documentController = require('../3controllers/documentController');

router.get('/documents', documentController.getDocument);
router.post('/documents', documentController.createDocument);

module.exports = router;