const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');
let passportConfig = require('../config/passport');
passportConfig.config();

router.route('/check').get(function(req, res) {
  res.status(200);
  res.send('API is working');
});

router.route('/auth/facebook')
  .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
      id: req.user.id
    };

    next();
  }, userController.generateToken, userController.sendToken);

router.route('/auth/emailSignup')
  .post(function(req, res, next){
    console.log(req.body);
    next();
  },passport.authenticate('local-signup'))

router.route('/auth/me')
  .get(
      userController.authenticate, 
      userController.getCurrentUser, 
      userController.getOne, 
      function(err, req, res, next) {
        if (err) {
          res.status(401).send('invalid token')
        }
      });

module.exports = router;