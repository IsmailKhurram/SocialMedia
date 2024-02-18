const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  },
  { collection: 'post-data', timestamps: true }
);

const PostModel = mongoose.model('PostData', PostSchema);

module.exports = PostModel;
