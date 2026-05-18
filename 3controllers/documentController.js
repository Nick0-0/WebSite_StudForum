const { timeStamp, error } = require('console');
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
    },

    reportDocument: async (req, res) => {
        const db = require('../db');
        try {
            const {documentId, reason} = req.body;
            const studentId = req.session.userId;

            console.log("Report data from student:", {documentId, reason, studentId});

            if (!documentId || !reason) {
                return res.status(400).json({success: false, error: 'Missing fields'});
            }

            const payLoad = {
                type: 'complaint',
                document_id: documentId, 
                reason: reason, 
                timeStamp: new Date().toLocaleDateString('ru-RU')
            };

            const sql = `
                INSERT INTO Journal (table_name, record_id, action_type, new_data, type_of_user, user_id)
                VALUES ('Documents', ?, 'insert', ?, 'student', ?)
            `;

            db.run(sql, [documentId, JSON.stringify(payLoad), studentId], function(err) {
                if (err) {
                    console.error("Report document error:", err);
                    return res.status(500).json({success: false, error: 'Database save error'});
                }
                return res.json({success: true});
            });
        } catch (error) {
            console.error("Method reportDocument error:", error);
            res.status(500).json({success: false, error: 'Report document error'});
        }
    },

    deleteDocument: async (req, res) => {
        try {
            const docId = req.params.id;
            await Document.delete(docId);
            
            return res.json({success: true});
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, error: 'Database delete document error'});
        }
    },

    getComplaintsJSON: async (req, res) => {
        const db = require('../db');
        const sql = `SELECT * FROM Journal WHERE table_name = 'Documents' AND action_type = 'insert' ORDER BY id DESC`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: 'Database error'});
            }

            const complaints = rows.map(row => {
                try {
                    const parsedData = JSON.parse(row.new_data);
                    if (parsedData.type === 'complaint') {
                        return {
                            journal_id: row.id,
                            student_id: row.user_id,
                            document_id: parsedData.document_id,
                            reason: parsedData.reason,
                            timeStamp: parsedData.timeStamp
                        };
                    }
                } catch (error) {
                    return null;
                }
                return null;
            }).filter(c => c !== null);
            return res.json(complaints);
        });
    },

    rejectComplaint: async (req, res) => {
        const db = require('../db');
        const sql = `DELETE FROM Journal WHERE id = ?`;

        db.run(sql, [req.params.id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({success: false, error: 'Database error'});
            }

            return res.json({success: true});
        });
    }
};

module.exports = documentController;