// const mongoose = require('../mongoose');
const	jwt = require('jsonwebtoken');
const	expressJwt = require('express-jwt');

// mongoose();
// let User = require('mongoose').model('User');
const User = require('../models/User');

let createToken = function(auth) {
	return jwt.sign({
		id: auth.id
	}, 'my-secret',
	{
		expiresIn: 60 * 120
	});
}

exports.generateToken = function (req, res, next) {
	req.token = createToken(req.auth);
	next();
}

exports.sendToken = function (req, res) {
	res.setHeader('x-auth-token', req.token);
	res.status(200).send(req.auth);
}

exports.authenticate = expressJwt({
	secret: 'my-secret',
	requestProperty: 'auth',
	getToken: function(req) {
		if (req.headers['x-auth-token']) {
			return req.headers['x-auth-token'];
		}
		return null;
	}
})

exports.getCurrentUser = function(req, res, next) {
	User.findById(req.auth.id, function(err, user) {
		if (err) {
			next(err);
		} else {
			req.user = user;
			next();
		}
	})
}

exports.getOne = function (req, res) {
	let user = req.user.toObject();

	delete user['facebookProvider'];
	delete user['__v'];

	res.json(user);
}