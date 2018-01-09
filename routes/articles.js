const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// Bring in Article model
let Article = require('../models/article');

// Load Edit Form
router.get('/edit/:id', (req, res) => {
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
router.get('/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Articles'
  });
});

// Get Single Article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, function (err, article) {
    if (err) {
      console.log(err);
    } else {
      res.render('article', {
        title: 'Article',
        article
      });
    }
  });
});

// Parse POST request parameters to req.body
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var formArticlesValidation = [
  check('title', 'The Title must be set').not().isEmpty(),
  check('author', 'The Author must be set').not().isEmpty(),
  check('body', 'The Body must be set').not().isEmpty()
];

// Add Submit POST Route
router.post('/add', urlencodedParser, formArticlesValidation, function (req, res) {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('add_article', {
      title: 'Add Articles',
      errors: errors.mapped()
    });
  } else {
    let article = new Article({
      title: req.body.title,
      author: req.body.author,
      body: req.body.body
    });
    article.save((err, article) => {
      if (err) {
        req.flash('danger', 'Article add operation failed');
        console.error(err);
        return;
      } else {
        req.flash('success', 'Article added');
        res.redirect('/');
      }
    });
  }  
});

// Update Submit POST Route
router.post('/edit/:id', urlencodedParser, function (req, res) {

  let query = {_id: req.params.id};
  let article = {
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  }

  // Update Aticle
  Article.update(query, article, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash('success', 'Article updated');
      res.redirect('/');
    }
  });
});

// Delete Article
router.delete('/:id', function(req, res) {
  let query = {_id:req.params.id}

  Article.remove(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  })
});

module.exports = router;
