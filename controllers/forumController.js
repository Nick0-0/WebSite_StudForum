const Topic = require('../models/ForumPost');
const Comment = require('../models/Comment');

const forumController = {
    //displaying the main forum page
    renderForum: async (req, res) => {
        try {
            const query = req.query.search;
            let topics;

            if (query) {
                topics = await Topic.search(query);
            } else {
                topics = await Topic.getAll();
            }

            res.render('forum', {topics});
        } catch (error) {
            res.status(500).send('Loading forum error');
        }
    },

    //creating new topic
    createTopic: async (req, res) => {
        const {name} = req.body;
        const {userId, role} = req.session;

        try {
            await Topic.create(name, role, userId);
            res.redirect('/forum');
        } catch (error) {
            res.status(500).send('Create topic error');
        }
    },

    //Getting for a specific topic (for modal window)
    getTopicDetails: async (req, res) => {
        const topicId = req.params.id;
        try {
            const comments = await Comment.getByTopic(topicId);
            res.json({comments});
        } catch (error) {
            res.status(500).json({error: 'Loading comments error'});
        }
    },

    //add comment
    addComment: async (req, res) => {
        const {topicId, description} = req.body;
        const {userId, role} = req.session;

        try {
            await Comment.create(topicId, role, userId, description);
            // res.redirect('/forum');
            //now we have AJAX requests
            return res.json({success: true});
        } catch (error) {
            // res.status(500).send('Add comment error');
            console.error(error);
            return res.status(500).json({success: false, error: 'Add comment error'});
        }
    },

    //delete topic (only for admins)
    deleteTopic: async (req, res) => {
        if (req.session.role !== 'admin') {
            return res.status(403).json({success: false, error: 'Not access rights'});
        }

        try {
            const topicId = req.params.id;
            await Topic.delete(topicId);
            res.json({success: true});
        } catch (error) {
            console.error("CRITICAL DB ERROR BY DELETE TOPIC:", error);
            res.status(500).json({success: false, error: 'Delete topic error'});
        }
    },

    reportForumItem: async (req, res) => {
        const db = require('../db');
        try {
            const { itemId, itemName, targetType, reason } = req.body;
            const studentId = req.session.userId;

            const tableName = targetType === 'topic' ? 'Topics' : 'Comments';
            const payload = { 
                type: `complaint_${targetType}`,
                target_id: itemId,
                target_name: itemName,
                reason: reason, 
                timestamp: new Date().toLocaleString('ru-RU') 
            };

            const sql = `
                INSERT INTO Journal (table_name, record_id, action_type, new_data, type_of_user, user_id)
                VALUES (?, ?, 'insert', ?, 'student', ?)
            `;

            db.run(sql, [tableName, itemId, JSON.stringify(payload), studentId], (err) => {
                if (err) {
                    console.error("Report forum save error:", err);
                    return res.status(500).json({ success: false, error: 'Database error' });
                }
                return res.json({ success: true });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    },

    deleteComment: async (req, res) => {
        if (req.session.role !== 'admin') {
            return res.status(403).json({error: 'Not access rights'});
        }

        try {
            const commentId = req.params.id;
            const comment = require('../models/Comment');

            await Comment.delete(commentId);

            return res.json({success: true});
        } catch (error) {
            console.error("Delete comment from DB error:", error);
            return res.status(500).json({success: false, error: 'Database delete comment error'});
        }
    }
};

module.exports = forumController;