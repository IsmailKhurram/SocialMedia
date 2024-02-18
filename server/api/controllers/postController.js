const Post = require('../models/post.model');

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
    });
    res.json({ status: 'ok', post: newPost });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', error: 'Post creation failed' });
  }
};

exports.getPosts = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('friends');
      
      const friendIds = user.friends.map(friend => friend._id);
      
      const posts = await Post.find({
        author: { $in: [...friendIds, userId] },
      });
      
      res.json({ status: 'ok', posts });
    } catch (err) {
      console.log(err);
      res.json({ status: 'error', error: 'Could not retrieve posts' });
    }
  };

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    res.json({ status: 'ok', message: 'Post deleted' });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', error: 'Post deletion failed' });
  }
};