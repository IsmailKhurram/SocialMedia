const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../utils/jwtHelper');

router.post('/createpost', verifyToken, postController.createPost);
router.get('/getposts', postController.getPosts);
router.delete('/deletepost/:id', verifyToken, postController.deletePost);

module.exports = router;
