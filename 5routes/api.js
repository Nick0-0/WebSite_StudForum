const router = require('express').Router();
const documentController = require('../3controllers/documentController');

//CRUD operations with documents
router.get('/api/documents', documentController.getDocument);
router.post('/api/documents', documentController.createDocument);
router.get('/api/documents/:id', documentController.getDocumentById);
router.put('/api/documents/:id', documentController.updateDocument);
router.delete('/api/documents/:id', documentController.deleteDocument);


module.exports = router;