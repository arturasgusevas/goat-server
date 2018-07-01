'use strict';

const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
// const LocalTokenStrategy = require('passport-local')
const User = require('mongoose').model('User');

exports.config = function() {
  passport.use(new FacebookTokenStrategy({
      clientID: '233355730725067',
      clientSecret: 'd9c773709b4f226dc5ac8890949c088d'
    },
    function (accessToken, refreshToken, profile, done) {
      User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    }));
  // passport.use(new LocalTokenStrategy({}))

};