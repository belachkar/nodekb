const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// Bring in User model
let User = require('../models/user');

// Register form
router.get('/register', function(req, res){
  res.render('register', {
    title: 'Register'
  });
});


// Validation of the Post Requst Parameters
let urlencodedParser = bodyParser.urlencoded({ extended: false });
/*
let formArticlesValidation = [
  check('name', 'The name must be set').not().isEmpty(),
  check('name', 'The name lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
  check('email', 'The Email must be set').not().isEmpty(),
  check('email', 'It must be a valid Email').isEmail(),
  check('username', 'The username must be set').not().isEmpty(),
  check('username', 'The username lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
  check('password', 'The Title must be set').not().isEmpty(),
  check('password', 'The password lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
  check('password2', 'Passwords do not match').equals('passowrd')
];*/
// Login template
router.get('/login', (req, res, next) => {
    res.render('login', {
      title: 'Login'
    });
});

// Register Proccess
router.post('/register', urlencodedParser, /*[
  body('name', 'The name must be set').not().isEmpty(),
  body('name', 'The name lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
  body('email', 'The Email must be set').not().isEmpty(),
  body('email', 'The Email must be valid').isEmail(),
  body('username', 'The username must be set').not().isEmpty(),
  body('username', 'The username lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
  body('password', 'The password must be set').not().isEmpty(),
  body('password', 'The password lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
  body('password2', 'Passwords do not match').equals(req.body.password)]
  ,*/ (req, res) => {
  if(!req.body) {
    return res.sendStatus(400);
  } else {
    body('name', 'The name must be set').not().isEmpty(),
    body('name', 'The name lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
    body('email', 'The Email must be set').not().isEmpty(),
    body('email', 'The Email must be valid').isEmail(),
    body('username', 'The username must be set').not().isEmpty(),
    body('username', 'The username lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
    body('password', 'The password must be set').not().isEmpty(),
    body('password', 'The password lenght must be between 6 and 20 caracteres').isLength({ min: 6, max: 20 }),
    body('password2', 'Passwords do not match').equals(req.body.password);
    let errors = validationResult(req);
    console.log('errors: errors.mapped()', req.query);
    if(!errors.isEmpty()) {
      res.render('register', {
        title: 'Register',
        errors: errors.mapped()
      });
    } else {
      let user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, function(err1, salt){
        if (err1) {
          console.log('err1', err1);
          return;
        } else {
          bcrypt.hash(user.password, salt, function(err2, hash) {
            if (err2) {
              console.log('err2', err2);
              return;
            } else {
              user.password = hash;
              user.save((err3, user) => {
                if (err3) {
                  req.flash('danger', 'user Add operation to the DB FAILED');
                  console.log('err3', err3);
                  return;
                } else {
                  req.flash('success', 'The Operation success, you are now registered and you can now log in');
                  res.redirect('/users/login');
                }
              });
            }
          });
        }
      });
    }
  }
});

module.exports = router;
