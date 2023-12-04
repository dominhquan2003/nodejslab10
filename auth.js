const passport = require('passport');
const express = require('express');
const app = express();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:8080/auth/google/callback`
},
      function (accessToken, refreshToken, profile, done) {
            done(null, profile);
      }
));

passport.serializeUser(function (user, done) {
      done(null, user.id);
});
passport.deserializeUser(function (user, done) {
      done(null, user.id);
});