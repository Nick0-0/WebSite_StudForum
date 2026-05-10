const {Document} = require('../4models/Document');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('dotenv').config().parsed;

exports.createDocument = async (req, res) => {
    try {
        const {typeOfDocument, doc} = req.body;
        const studentId = req.user.id;

        const newDoc = new Document({
            typeOfDocument,
            studentId,
            doc
        });

        const document = await newDoc.create();
        res.status(201).json({message: 'Document has been successfuly created',
            document: document.toObject()
        });
    } catch (error) {
        res.status(500).json({error: 'Create doc error'});
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({error: 'Document not found'});
        }

        if (document.studentId !== req.user.id) {
            return res.status(403).json({error: 'Not access rights'});
        }

        res.json(document.toObject());
    } catch (error) {
        res.status(500).json({error: 'Get document by id error'});
    }
};

exports.getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.findByStudentId(req.user.id);
        res.json({documents: documents.map(doc => doc.toObject())});
    } catch (error) {
        res.status(500).json({error: 'Get documents error'});
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({error: 'Doc not found'});
        }

        if (document.studentId !== req.user.id) {
            return res.status(403).json({error: 'Not access rights'});
        }

        const {typeOfDocument, doc} = req.body;
        document.typeOfDocument = typeOfDocument;
        document.doc = doc;

        await document.update();
        res.json({message: 'Doc has been successfuly updated'});
    } catch (error) {
        res.status(500).json({error: 'Update document error'});
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({error: 'Document not found'});
        }

        if (document.studentId !== req.user.id) {
            return res.status(403).json({error: 'Not access rights'});
        }

        await document.delete();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Delete document error'});
    }
};