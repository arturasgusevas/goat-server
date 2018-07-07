const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  photoURL: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
  },
  facebookProvider: {
    type: {
      id: String,
      token: String,
    },
    select: false,
  },
});

userSchema.set('toJSON', { getters: true, virtuals: true });

userSchema.statics.upsertFbUser = (accessToken, refreshToken, profile, cb) => {
  const That = this;
  return this.findOne({
    'facebookProvider.id': profile.id,
  }, (err, user) => {
    if (!user) {
      const newUser = new That({
        fullName: profile.displayName,
        photoURL: profile.photos[0].value,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken,
        },
      });

      newUser.save((error, savedUser) => {
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

userSchema.statics.generateHash = password => bcrypt.hashSync(password,
  bcrypt.genSaltSync(8), null);

const User = mongoose.model('User', userSchema);

module.exports = User;
