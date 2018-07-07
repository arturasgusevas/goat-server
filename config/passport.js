const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
// const LocalTokenStrategy = require('passport-local')
const User = require('mongoose').model('User');

exports.config = () => {
  passport.use(new FacebookTokenStrategy({
    clientID: '233355730725067',
    clientSecret: 'd9c773709b4f226dc5ac8890949c088d',
  },
    ((accessToken, refreshToken, profile, done) => {
      User.upsertFbUser(accessToken, refreshToken, profile, (err, user) => done(err, user));
    })));
};
