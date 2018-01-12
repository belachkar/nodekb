const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check connection
db.once('open', function () {
  console.log('connected to mongo DB');
}).on('error', function (err) {
  console.log(err);
});

// Init App
const app = express();

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Validator & Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Bring in models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', (req, res) => {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);
let users = require('./routes/users');
app.use('/users', users);

// Start Server
app.listen(3000, function () {
  console.log('server started on port 3000...');
});
