const Topic = require('../4models/ForumPost');
const Comment = require('../4models/Comment');

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
            return res.status(403).send('Not access rights');
        }

        try {
            await Topic.delete(req.params.id);
            res.json({success: true});
        } catch (error) {
            res.status(500).send('Delete topic error');
        }
    }
};

module.exports = forumController;