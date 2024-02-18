const mongoose = require('mongoose');
const CommentModel = require('./comment.model'); // Import Comment Model

// Define the Challenge Schema
const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    complexity: { type: String, enum: ['Bronze', 'Silver', 'Gold'], required: true },
    tags: [{ type: String }],
    description: {type: String},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Reference to Comment model
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
    picture: { type: String, default: '' },

  },
  { collection: 'challenge-data', timestamps: true }
);

const ChallengeModel = mongoose.model('ChallengeData', ChallengeSchema);

module.exports = ChallengeModel;
