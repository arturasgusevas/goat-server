const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

router.get('/check', (req, res) => {
  res.send('working');
});

router.post('/post',
  userController.authenticate,
  (req, res) => {
    const commentData = {
      message: req.body.message,
      userID: req.body.userID,
      userPhoto: req.body.userPhoto,
      username: req.body.username,
      postID: req.body.postID,
    };
    Post.findById(commentData.postID, (err, post) => {
      if (err) {
        res.send(err);
      }
      post.lastComment = Object.assign({}, commentData);
      delete post.lastComment.postID;
      post.save((error) => {
        if (error) {
          res.send(error);
        }
      });
    });
    const comment = new Comment(commentData);
    comment.save((err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  });

router.get('/all/:id',
  userController.authenticate,
  (req, res) => {
    Comment.find({ postID: req.params.id }, (err, data) => {
      res.send(data);
    });
  });

module.exports = router;
