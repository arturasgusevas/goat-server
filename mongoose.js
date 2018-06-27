'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function () {

  let db = mongoose.connect('mongodb://admin:test123@ds227858.mlab.com:27858/test-db1', {
  	useMongoClient: true
  });

  let UserSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    facebookProvider: {
      type: {
        id: String,
        token: String
      },
      select: false
    }
  });

  UserSchema.set('toJSON', {getters: true, virtuals: true});

  UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    let that = this;
    return this.findOne({
      'facebookProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        let newUser = new that({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          facebookProvider: {
            id: profile.id,
            token: accessToken
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    });
  };

  mongoose.model('User', UserSchema);

  return db;
};