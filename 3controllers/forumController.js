const {Topic} = require('../4models/ForumPost');
const {Comment} = require('../4models/Comment');

//auth checking
function authenticate(req, res, next) {
    if (!req.user) {
        return res.status(401).json({error: 'Not authenticate access'});
    }
    next();
}

exports.createPost = async (req, res) => {
    await authenticate(req, res, async () => {
        try {
            const {name} = req.body;
            const newTopic = new Topic({
                name, typeOfUser: req.user.role,
                userId: req.user.id
            });

            await newTopic.create();
            res.status(201).json(newTopic.toObject());
        } catch (error) {
            res.status(500).json({error: 'Create topic error'});
        }
    });
};

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll();
        res.status(200).json(topics.map(topic => topic.toObject()));
    } catch (error) {
        res.status(500).json({error: 'Get topics error'});
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({error: 'Post not found'});
        }

        res.status(200).json(topic.toObject());
    } catch (error) {
        res.status(500).json({error: 'Get post by id error'});
    }
};

exports.updateTopic = async (req, res) => {
    await authenticate(req, res, async () => {
        try {
            const topic = await Topic.findById(req.params.id);

            if (!topic) {
                return res.status(404).json({error: 'Post not found'});
            }

            if (topic.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({error: 'Not access rights to edit'});
            }

            const {name} = req.body;
            await topic.update({name});
            res.status(200).json(topic.toObject());
        } catch (error) {
            res.status(500).json({error: 'Update topic error'});
        }
    });
};

exports.deletePost = async (req, res) => {
    await authenticate(req, res, async () => {
        try {
            const topic = await Topic.findById(req.params.id);

            if (!topic) {
                return res.status(404).json({error: 'Topic not found'});
            }

            if (topic.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({error: 'Not access rights to delete'});
            }

            await topic.delete();
            res.status(200).send();
        } catch (error) {
            res.status(500).json({error: 'Delete topic error'});
        }
    });
};

exports.createComment = async (req, res) => {
    await authenticate(req, res, async () => {
        try {
            const {description} = req.body;
            const newComment = await Comment.create({
                topicId: req.params.topicId,
                typeOfUser: req.user.role,
                userId: req.user.id,
                description
            });
            
            await newComment.create();
            res.status(201).json(newComment.toObject());
        } catch (error) {
            res.status(500).json({error: 'Create comment error'});
        }
    });
};

exports.getCommentsByTopic = async (req, res) => {
    try {
        const comments = await Comment.findByTopicId(req.params.topicId);
        res.status(200).json(comments.map(comment => comment.toObject()));
    } catch (error) {
        res.status(500).json({error: 'Get comments list by topic id error'});
    }
};

exports.updateComment = async (req, res) => {
    await authenticate(req, res, () => {
        try {
            const comment = await Comment.findById(req.params.id);

            if (!comment) {
                return res.status(404).json({error: 'Comment not found'});
            }

            if (comment.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({error: 'Not access rights to delete'});
            }

            const {description} = req.body;
            await comment.update({description});
            res.status(200).json(comment.toObject());
        } catch (error) {
            res.status(500).json({error: 'Update comment error'});
        }
    });
};

exports.deleteComment = async (req, res) => {
    authenticate(req, res, async () => {
        try {
            const comment = await Comment.findById(req.params.id);

            if (!comment) {
                return res.status(404).json({error: 'Comment not found'});
            }

            if (comment.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({error: 'Not access rights to delete'});
            }

            await comment.delete();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({error: 'Delete comment error'});
        }
    });
};

exports.moderateTopic = async (req, res) => {
    await authenticate(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({error: 'Not access rights to moderate'});
        }

        try {
            const topic = await Topic.findById(req.params.id);

            if (!topic) {
                return res.status(404).json({error: 'Post not found'});
            }
            
            const {typeOfUser} = req.body;
            await topic.update({typeOfUser});
        } catch (error) {
            res.status(500).json({error: 'Moderate Post error'});
        }
    });
};

exports.searchTopics = async (req, res) => {
    try {
        const {query} = req.body;
        const topics = await Topic.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%`
                }
            }
        });
        res.status(200).json(topics.map(topic => topic.toObject()));
    } catch (error) {
        res.status(500).json({error: 'Search topics error'});
    }
};