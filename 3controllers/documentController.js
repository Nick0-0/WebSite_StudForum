const Document = require('../4models/Document');
const fs = require('fs');

const documentController = {
    //displaying document list
    renderDocuments: async (req, res) => {
        try {
            const documents = await Document.getPublic();
            res.render('document', {
                documents, 
                user: req.session.userId,
                role: req.session.role
            });
        } catch (error) {
            res.status(500).send('Loading list of documents error');
        }
    },

    //Uploading (create) new document
    uploadDocument: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send('File is not selected');
            }

            const { type_of_document } = req.body;
            const studentId = req.session.userId;

            const fileData = fs.readFileSync(req.file.path);

            await Document.create(type_of_document, studentId, fileData);

            fs.unlinkSync(req.file.path);

            res.redirect('/document');
        } catch (error) {
            console.error("Download doc error: ", error);
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).send('Saving doc error');
        }
    },

    //download document
    downloadDocument: async (req, res) => {
        try {
            const doc = await Document.getById(req.params.id);
            if (!doc) return res.status(404).send('File not found');

            let ext = '.txt';

            if (doc.doc) {
                const buffer = Buffer.from(doc.doc);
                
                if (buffer.length > 4) {
                    if (buffer.toString('ascii', 0, 2) === 'PK') {
                        ext = '.docx';
                    }
                    else if (buffer.toString('ascii', 0, 4) === '%PDF') {
                        ext = '.pdf';
                    }
                }
                
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename=document_${doc.id}${ext}`);
                
                return res.send(doc.doc);
            }
            res.status(404).send('File data is empty');
        } catch (error) {
            res.status(500).send('Download doc error');
        }
    },

    getMyDocuments: async (req, res) => {
        try {
            const myDocs = await Document.getByStudentId(req.session.userId);
            res.json(myDocs);
        } catch (error) {
            res.status(500).json({error: 'Download private documents error'});
        }
    }
};

module.exports = documentController;