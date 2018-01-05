const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check connection
db.once('open', function () {
  console.log('connected to mongo DB');
});

// Check for DB errors
db.on('error', function (err) {
  console.log(err);
});

// Init App
const app = express();

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Get Single Article
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, function (err, article) {
    if (err) {
      console.log(err);
    } else {
      res.render('article', {
        article
      });
    }
  });
});

// Load Edit Form
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, function (err, article) {
    if (err) {
      console.log(err);
    } else {
      res.render('edit_article', {
        title: 'Edit Article',
        article
      });
    }
  });
});

// Add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Articles'
  });
});

// Parse POST request parameters to req.body
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Add Submit POST Route
app.post('/articles/add', urlencodedParser, function (req, res) {
  let article = new Article({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  }).save((err, article) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

// Update Submit POST Route
app.post('/articles/edit/:id', urlencodedParser, function (req, res) {

  let query = {_id: req.params.id};
  let article = {
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  }

  Article.update(query, article, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/article/:id', function(req, res) {
  let query = {_id:req.params.id}

  Article.remove(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  })
});

// Start Server
app.listen(3000, function () {
  console.log('server started on port 3000...');
});
