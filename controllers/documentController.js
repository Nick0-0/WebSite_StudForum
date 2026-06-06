const { timeStamp, error } = require('console');
const Document = require('../models/Document');
const Topic = require('../models/ForumPost');
const fs = require('fs');

const documentController = {
    //displaying document list
    renderDocuments: async (req, res) => {
        try {
            const documents = await Document.getPublic();
            const topics = await Topic.getAll();

            res.render('document', {
                documents,
                topics,
                role: req.session.role
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Loading list of documents error');
        }
    },

    //Uploading (create) new document
    uploadDocument: async (req, res) => {
        try {
            const {type_of_document, custom_name, topic_id} = req.body;
            const studentId = req.session.userId;

            if (!req.file) {
                return res.status(400).send('File is not selected');
            }

            const fileName = req.file.originalname;
            const fileData = fs.readFileSync(req.file.path);

            const finalType = type_of_document === 'private' ? 'private' : `public:${custom_name || fileName}`;

            await Document.create(studentId, fileData, finalType, topic_id);

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
            console.log(`[DEBUGGING] METHOD downloadDocument WAS CALLED TO FILE ID: ${req.params.id}`);
            const documentRecord = await Document.getById(req.params.id);
            if (!documentRecord) return res.status(404).send('File not found');

            let ext = '.txt';

            //plan BETA
            if (documentRecord.type_of_document && documentRecord.type_of_document.includes(':')) {
                const match = documentRecord.type_of_document.match(/\.(docx|pdf|txt)$/i);
                if (match) {
                    ext = match[0].toLowerCase();
                }
            }

            if (documentRecord.doc) {
                // const buffer = Buffer.from(doc.doc);
                //const buffer = Buffer.isBuffer(doc.doc) ? doc.doc : Buffer.from(doc.doc);
                
                let buffer;
                if (Buffer.isBuffer(documentRecord.doc)) {
                    buffer = documentRecord.doc;
                } else if (typeof documentRecord.doc === 'string') {
                    buffer = Buffer.from(documentRecord.doc, 'binary');
                } else {
                    buffer = Buffer.from(documentRecord.doc);
                }

                if (buffer.length > 4) {
                    const hexSignature = buffer.toString('hex', 0, 4);

                    console.log(`[DEBUGGING] Hex-title of file #${documentRecord.id}:`, hexSignature);

                    //plan ALFA
                    if (hexSignature.startsWith('504b')) {
                        ext = '.docx';
                    }
                    else if (hexSignature.startsWith('25504446')) {
                        ext = '.pdf';
                    }
                }

                let downloadName = `document_${documentRecord.id}`;
                if (documentRecord.type_of_document && documentRecord.type_of_document.includes(':')) {
                    const parts = documentRecord.type_of_document.split(':');
                    let rawName = parts.slice(1).join(':');

                    downloadName = rawName.replace(/\.(docx|pdf|txt)$/i, '');
                }
                const finalFileName = downloadName + ext;
                
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(finalFileName)}`);
                
                return res.send(buffer);
            }
            res.status(404).send('File data is empty');
        } catch (error) {
            console.error('CRITICAL Download file controller error:', error);
            res.status(500).send('Download doc error');
        }
    },

    getMyDocuments: async (req, res) => {
        try {
            const studentId = req.session.userId;
            const docs = await Document.getByStudentId(studentId);
            return res.json(docs);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'API load personal documents error' });
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
        const sql = `SELECT * FROM Journal 
        WHERE table_name IN ('Documents', 'Topics', 'Comments') AND action_type = 'insert' 
        ORDER BY id DESC`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: 'Database error'});
            }

            const complaints = rows.map(row => {
                try {
                    const parsedData = JSON.parse(row.new_data);
                    if (parsedData.type && parsedData.type.startsWith('complaint')) {
                        let targetTextName = '';
                        if (row.table_name === 'Documents') {
                            targetTextName = parsedData.document_name || `Документ #${parsedData.document_id || row.record_id}`;
                        } else {
                            targetTextName = parsedData.target_name || parsedData.reason_title || '';
                        }

                        return {
                            journal_id: row.id,
                            student_id: row.user_id,
                            target_table: row.table_name,
                            target_id: parsedData.document_id || parsedData.target_id || row.record_id,
                            target_name: targetTextName,
                            reason: parsedData.reason,
                            timestamp: parsedData.timestamp || parsedData.timeStamp || 'Время неизвестно'
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
                console.error("Reject complaint DB error:", err);
                return res.status(500).json({success: false, error: 'Database error'});
            }

            return res.json({success: true});
        });
    }
};

module.exports = documentController;