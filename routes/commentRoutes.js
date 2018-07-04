const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

router.get('/check', (req, res) => {
    res.send('working')
})

router.post('/post',
    userController.authenticate,
    function(req, res) {
        const commentData = {
            message: req.body.message,
            userID: req.body.userID,
            userPhoto: req.body.userPhoto,
            username: req.body.username,
            postID: req.body.postID
        };
        Post.findById(commentData.postID, function(err, post) {
            if (err) { console.log(err) };
            post.lastComment = Object.assign({}, commentData);
            delete post.lastComment.postID;
            post.save(function(err, updatedPost) {
                if (err) {console.log(err);}
            });
        })
        let comment = new Comment(commentData);
        comment.save(function(err, data) {
        	if (err) {
        		res.send(err)
        	} else {
        		res.send(data)
        	}
        })
    })

module.exports = router;