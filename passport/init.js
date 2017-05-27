var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
require('./../models/player');
var Player = mongoose.model('Player');
var md5 = require('MD5');

passport.use('login',new LocalStrategy({
    passReqToCallback : true
    },
    function(req,username, password, done) { 
      Player.findOne({ username: username }, function (err, user) {
      if (err) { return done(err,false); }
      if (!user) {
        return done(null, false);
      }
      if(user.active == 0)
        return done(null,false);
      if (user.password!=md5(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use('adminlogin',new LocalStrategy({
    passReqToCallback : true
    },
    function(req,username, password, done) { 
    Player.findOne({ username: username }, function (err, user) {
      if (err) { return done(err,false); }
      if (!user) {
        return done(null, false);
      }
      if(user.active == 0)
        return done(null,false);
      if (user.password!=md5(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Player.findById(id, function(err, user) {
    done(err, user);
  });
});