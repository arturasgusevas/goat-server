const express = require('express');

const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const userController = require('../controllers/user');
const postController = require('../controllers/post');


const DIR = './uploads';
let filepath = '';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    filepath = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filepath);
  },
});
const upload = multer({ storage });


router.route('/post')
  .post(
    userController.authenticate,
    upload.single('photo'),
    postController.resize,
    (req, res) => {
      const imagePath = req.file.path.replace('uploads\\', '');
      const postData = {
        image: imagePath,
        thumbnail: res.locals.thumbPath,
        description: req.body.description,
        user: req.body.user,
      };
      const post = new Post(postData);
      post.save((err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      });
    },
  )
  .get(userController.authenticate, (req, res) => {
    Post.find({}, (err, data) => {
      res.send(data);
    });
  });


router.delete('/post/:id',
  userController.authenticate,
  (req, res, next) => {
    Post.findById(req.params.id, (err, data) => {
      if (req.auth.id !== data.user) {
        res.send({ error: 'cannot delete other user\'s post' });
      } else {
        fs.unlink(`uploads/${data.image}`, (error) => {
          if (error) {
            res.json({ error });
          } else {
            fs.unlink(`uploads/${data.thumbnail}`, (e) => {
              if (e) {
                res.json({ error: e });
              } else {
                next();
              }
            });
          }
        });
      }
    });
  },
  (req, res) => {
    Post.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json({ message: 'post deleted' });
      }
    });
  });

module.exports = router;
