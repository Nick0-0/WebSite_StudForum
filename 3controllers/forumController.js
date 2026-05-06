const {ForumPost, Comment} = require('../4models');
const {validationResult} = require('express-validator');

//auth checking
function authenticate(req, res, next) {
    if (!req.user) {
        return res.status(401).json({error: 'Not authenticate access'});
    }
    next();
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await ForumPost.findAll({
            include: [Comment],
            order: [['CreatedAt', 'DESC']]
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: 'Get posts error'});
    }
};

exports.createPost = async (req, res) => {
    await authenticate(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {title, content} = req.body;
        const post = await ForumPost.create({
            title, content, userId: req.user.id, status: 'pending'
        });
        res.status(201).json(posts);
    } catch (error) {
        res.status(500).json({error: 'Get all posts list error'});
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await ForumPost.findByPk(req.params.id, {
            include: [Comment]
        });

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error: 'Get post by id error'});
    }
};

exports.updatePost = async (req, res) => {
    await authenticate(req, res);

    try {
        const post = await ForumPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({error: 'Not access rights to edit post'});
        }

        await post.update(req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error: 'Update post error'});
    }
};

exports.deletePost = async (req, res) => {
    await authenticate(req, res);

    try {
        const post = await ForumPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({error: 'Not access rights to delete'});
        }

        await post.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Delete post error'});
    }
};

exports.createComment = async (req, res) => {
    await authenticate(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {content} = req.body;
        const comment = await Comment.create({
            content, userId: req.user.id, postId: req.params.postId
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({error: 'Create comment error'});
    }
};

exports.updateComment = async (req, res) => {
    await authenticate(req, res);

    try {
        const comment = await Comment.findByPk(req.params.commentId);

        if (!comment) {
            return res.status(404).json({error: 'Comment not found'});
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({error: 'Not access rights to delete'});
        }

        await comment.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Delete post id'});
    }
};

exports.moderatePost = async (req, res) => {
    await authenticate(req, res);

    if (req.user.role !== 'admin') {
        return res.status(403).json({error: 'Not access rights to moderate'});
    }

    try {
        const post = await ForumPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        const {status} = req.body;
        await post.update({status});
    } catch (error) {
        res.status(500).json({error: 'Moderate Post error'});
    }
};