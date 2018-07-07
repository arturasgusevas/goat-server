const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  userID: {
    type: String,
  },
  userPhoto: {
    type: String,
  },
  username: {
    type: String,
  },
  postID: {
    type: String,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
