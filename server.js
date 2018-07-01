'use strict';

//mongoose file must be loaded before all other files in order to provide
// models to other modules
const mongoose = require('mongoose');
// const	passport = require('passport');
const	express = require('express');
const	router = express.Router();
const	cors = require('cors');
const	bodyParser = require('body-parser');

const routes = require('./routes/routes');

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

app.use('/api', routes);

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000/');