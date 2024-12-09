const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// Post routes
router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/:id/like', postController.likePost);
router.post('/:id/repost', postController.repostPost);

module.exports = router;