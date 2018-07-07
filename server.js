// mongoose file must be loaded before all other files in order to provide
// models to other modules
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

mongoose.Promise = require('bluebird');

const app = express();
mongoose.connect('mongodb://admin:test123@ds227858.mlab.com:27858/test-db1', {
  useMongoClient: true,
});
// enable cors
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};
app.use(cors(corsOption));

// rest API requirements
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use(express.static('uploads'));

app.use('/check', (req, res) => {
  res.send('API is working');
});
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000/');
