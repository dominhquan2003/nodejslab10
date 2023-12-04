const express = require('express')
const Router = express.Router()
const passport = require('passport');
require('../auth')

Router.get('/', (req, res) => {
  res.render('index');
})

Router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

Router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/account/login' }),
  function (req, res) {

    res.redirect('/');
  });


module.exports = Router