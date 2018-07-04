const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Post = require('../models/Post');
const jwt = require('express-jwt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const DIR = './uploads';
let filepath = '';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        filepath = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filepath);
    }
});
let upload = multer({ storage: storage });


router.route('/post')
    .post(
        userController.authenticate,
        upload.single('photo'),
        function(req, res, next) {
        const postData = {
            image: req.file.path.replace('uploads', ''),
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

router.get('/test', function(req, res) {
    res.send('ok')
});

module.exports = router;