const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/User');

const createToken = auth => jwt.sign({
  id: auth.id,
}, 'my-secret', {
  expiresIn: 60 * 120,
});

exports.generateToken = (req, res, next) => {
  req.token = createToken(req.auth);
  next();
};

exports.sendToken = (req, res) => {
  res.setHeader('x-auth-token', req.token);
  res.status(200).send(req.auth);
};

exports.authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  },
});

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.auth.id, (err, user) => {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

exports.getOne = (req, res) => {
  const user = req.user.toObject();
  res.json(user);
};
