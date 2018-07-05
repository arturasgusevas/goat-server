const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');
const User = require('../models/User');
let passportConfig = require('../config/passport');
const bcrypt = require('bcrypt');
passportConfig.config();

router.route('/auth/facebook')
    .post(passport.authenticate('facebook-token', { session: false }), function(req, res, next) {
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
    .post(function(req, res, next) {
        if (req.body.email &&
            req.body.password) {
            let userData = {
                email: req.body.email,
                fullName: req.body.fullName,
                photoURL: req.body.photoURL,
                password: User.generateHash(req.body.password),
            }
            //use schema.create to insert data into the db
            User.create(userData, function(err, user) {
                if (err) {
                    if (err.code === 11000) {
                        res.json({'error': 'email already in use'});                        
                    }
                } else {
                    res.send('signed up');
                }
            });
        }
    })

router.route('/auth/login')
    .post(function(req, res, next) {
        User.findOne({ 'email': req.body.email })
            .exec(function(err, user) {
                if (err) {
                    res.send(err);
                } else if (!user) {
                    let err = new Error('User not found.');
                    err.status = 401;
                    res.send(err);
                } else {
                    req.auth = {
                        id: user.id
                    };

                    bcrypt.compare(req.body.password, user.password, function(err, result) {
                        if (result === true) {
                            next(null, user);
                        } else {
                            res.send('wrong pass')
                        }
                    })
                }
            });
    }, userController.generateToken, userController.sendToken);

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