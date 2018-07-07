const express = require('express');

const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const userController = require('../controllers/user');
const User = require('../models/User');
const passportConfig = require('../config/passport');

passportConfig.config();

router.route('/auth/facebook')
  .post(passport.authenticate('facebook-token', { session: false }), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
      id: req.user.id,
    };

    next();
  }, userController.generateToken, userController.sendToken);

router.route('/auth/emailSignup')
  .post((req, res) => {
    if (req.body.email
            && req.body.password) {
      const userData = {
        email: req.body.email,
        fullName: req.body.fullName,
        photoURL: req.body.photoURL,
        password: User.generateHash(req.body.password),
      };
      User.create(userData, (err) => {
        if (err) {
          if (err.code === 11000) {
            res.json({ error: 'email already in use' });
          }
        } else {
          res.send('signed up');
        }
      });
    }
  });

router.route('/auth/login')
  .post((req, res, next) => {
    User.findOne({ email: req.body.email })
      .exec((err, user) => {
        if (err) {
          res.send(err);
        } else if (!user) {
          const error = new Error('User not found.');
          error.status = 401;
          res.send(error);
        } else {
          req.auth = {
            id: user.id,
          };

          bcrypt.compare(req.body.password, user.password, (e, result) => {
            if (result === true) {
              next(null, user);
            } else {
              res.send('wrong pass');
            }
          });
        }
      });
  }, userController.generateToken, userController.sendToken);

router.route('/auth/me')
  .get(
    userController.authenticate,
    userController.getCurrentUser,
    userController.getOne,
    (err, req, res) => {
      if (err) {
        res.status(401).send('invalid token');
      }
    },
  );

module.exports = router;
