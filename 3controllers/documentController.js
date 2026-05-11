const Document = require('../4models/Document');

const documentController = {
    //displaying document list
    renderDocuments: async (req, res) => {
        try {
            const documetns = await Document.getPublic();
            res.render('document', {
                documents, 
                user: req.session.user,
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

            const {type_of_document} = req.body;
            const studentId = req.session.userId;

            await Document.create(type_of_document, studentId, req.file.buffer);

            res.redirect('/document');
        } catch (error) {
            res.status(500).send('Saving doc error');
        }
    },

    //download document
    downloadDocument: async (req, res) => {
        try {
            const doc = await Document.getById(req.params.id);
            if (!doc) return res.status(404).send('File not found');

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=document_${doc.id}`);

            res.send(doc.doc);
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