'use strict';

//mongoose file must be loaded before all other files in order to provide
// models to other modules
const mongoose = require('mongoose');
const	passport = require('passport');
const	express = require('express');
const	router = express.Router();
const	cors = require('cors');
const	bodyParser = require('body-parser');

const userController = require('./controllers/user');

let passportConfig = require('./config/passport');

//setup configuration for facebook login
passportConfig.config();

let app = express();

mongoose.connect('mongodb://admin:test123@ds227858.mlab.com:27858/test-db1', {
  	useMongoClient: true
});
// enable cors
let corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

router.route('/health-check').get(function(req, res) {
  res.status(200);
  res.send('Hello World');
});

router.route('/auth/facebook')
	.get(function(req, res) {
		res.json({message: 'get'})
	})
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


router.route('/auth/me')
  .get(userController.authenticate, userController.getCurrentUser, userController.getOne);

app.use('/api/v1', router);

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000/');