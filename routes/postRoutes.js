const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Post = require('../models/Post');
const jwt = require('express-jwt');
const fs = require('fs');

router.route('/post')
    .post(userController.authenticate, function(req, res, next) {
        const postData = {
            image: req.body.image,
            description: req.body.description,
            user: req.body.user
        };
        let post = new Post(postData);
        post.save(function(err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
            // next();
        })
    })
    .get(userController.authenticate, function(req, res, next) {
        Post.find({}, function(err, data) {
            res.send(data)
        })
    })

router.use('/public', express.static(__dirname + '/public'));  
router.use(express.static(__dirname + '/public')); 

router.post('/test',
    function(request, respond) {
        let body = '';
        console.log(request);
        // console.log(request.data);

        filePath = __dirname + '/public/data.jpg';
        // console.log(filePath)
        request.on('data', function(data) {
            console.log(data)
            body += data;
        });

        request.on('end', function() {
            fs.appendFile(filePath, body, function() {
                respond.end();
            });
        });
    });

module.exports = router;