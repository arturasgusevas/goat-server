const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  description: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  lastComment: {
    type: Object,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
