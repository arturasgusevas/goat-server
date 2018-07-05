'use strict';

//mongoose file must be loaded before all other files in order to provide
// models to other modules
const   mongoose = require('mongoose');
const	passport = require('passport');
const	express = require('express');
const	router = express.Router();
const	cors = require('cors');
const	bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

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

app.use(express.static('uploads'));
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// app.use(passport.initialize());
// app.use(passport.session());
app.use('/api', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000/');