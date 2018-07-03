const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    photoURL: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String
    },
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
})

userSchema.set('toJSON', { getters: true, virtuals: true });

userSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    let that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            let newUser = new that({
                fullName: profile.displayName,
                photoURL: profile.photos[0].value,
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

// UserSchema.statics.emailLogin = function (email, password, callback) {
//   User.findOne({ email: email })
//     .exec(function (err, user) {
//       if (err) {
//         return callback(err)
//       } else if (!user) {
//         var err = new Error('User not found.');
//         err.status = 401;
//         return callback(err);
//       }
//       bcrypt.compare(password, user.password, function (err, result) {
//         if (result === true) {
//           return callback(null, user);
//         } else {
//           return callback();
//         }
//       })
//     });
// }

userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// }

const User = mongoose.model('User', userSchema);

module.exports = User;