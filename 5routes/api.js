const router = require('express').Router();
const documentController = require('../3controllers/documentController');

//CRUD operations with documents
router.get('/documents', documentController.getDocument);
router.post('/documents', documentController.createDocument);
router.get('/documents/:id', documentController.getDocumentById);
router.put('/documents/:id', documentController.updateDocument);
router.delete('/documents/:id', documentController.deleteDocument);


module.exports = router;