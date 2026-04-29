const Document = require('../4models/Document');

exports.getDocument = async (req, res) => {
    try {
        const documents = await Document.getAll();
        res.json(documents);
    } catch (error) {
        res.status(500).json({error: 'Get documents error'});
    }
};
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.getById(id);
        if (!document) {
            return res.status(404).json({error: 'Document not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Get document error'});
    }
};
exports.createDocument = async (req, res) => {
    const {type_of_document, student_id, doc} = req.body;

    try {
        if (!type_of_document || !student_id || !doc) {
            return res.status(400).json({error: 'Not enough data'});
        }

        const newDocument = await Document.create({
            type_of_document,
            student_id,
            doc
        });

        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({error: 'Create document error'});
    }
};
exports.updateDocument = async (req, res) => {
    const {id} = req.params;
    const {type_of_document, student_id, doc} = req.body;

    try {
        const updatedDocument = await Document.update(id, {
            type_of_document,
            student_id,
            doc
        });
    } catch (error) {
        res.status(500).json({error: 'Update document error'});
    }
};
exports.deleteDocument = async (req, res) => {

    const {id} = req.params;
    
    try {
        const deleted = await Document.delete(id);
        
        if (!deleted) {
            return res.status(404).json({error: 'Document not found'});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Delete document error'});
    }
};