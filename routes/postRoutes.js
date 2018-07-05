const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Post = require('../models/Post');
const jwt = require('express-jwt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

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
        resize,
        function(req, res, next) {
            const imagePath = req.file.path.replace('uploads\\', '');
            const postData = {
                image: imagePath,
                thumbnail: res.locals.thumbPath,
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
            })
        })
    .get(userController.authenticate, function(req, res, next) {
        Post.find({}, function(err, data) {
            res.send(data)
        })
    })


router.delete('/post:id',
    userController.authenticate,
    function(req, res, next) {
        Post.findById(req.params.id, function(err, data) {
            console.log(req.auth.id);
            console.log(data.user);
            if (req.auth.id !== data.user) {
                res.send({ error: 'cannot delete other user\'s post' })
            } else {
                fs.unlink('uploads/'+data.image, err => {
                    if (err) { console.log(err) } else { 
                        console.log('deleted image') 
                        fs.unlink('uploads/'+data.thumbnail, err => {
                            if (err) { 
                                console.log(err) 
                            } else { 
                                console.log('deleted tumbnail');
                                next()
                            }
                        })
                    }
                })
            }
        })
    },
    function(req, res, next) {
        Post.deleteOne({ '_id': req.params.id }, function(err, data) {
            if (err) { console.log(err) } else {
                res.send('deleted')
            }
        })
    })

router.get('/test', function(req, res) {
    res.send('ok')
});

function resize(req, res, next) {
    sharp(req.file.path)
        .resize(200, 200)
        .toFile(`uploads/thumb_${req.file.filename}`, function(err, buf) {
            res.locals.thumbPath = `thumb_${req.file.filename}`;
            if (err) { console.log(err) }
            next();
        })
}

module.exports = router;