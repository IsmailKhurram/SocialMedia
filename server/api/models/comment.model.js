const mongoose = require('mongoose');

// Define the Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create the Comment Model
const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
