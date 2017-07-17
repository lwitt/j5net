'use strict';

var passport 	= require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../db/').models.user;

/**
* Encapsulates all code for authentication
* Either by using username and password, or by using social accounts
*
*/
var init = function(){

	// Serialize and Deserialize user instances to and from the session.
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// Plug-in Local Strategy
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: new RegExp(username, 'i') }, function(err, user) {
				if (err) { return done(err); }

				if (!user) {
					return done(null, false, { message: 'Incorrect username and/or password.' });
				}

				user.validatePassword(password, function(err, isMatch) {
					if (err) { return done(err); }
					if (!isMatch){
						return done(null, false, { message: 'Incorrect username and/or password.' });
					}
					return done(null, user);
				});

			});
		}
	));

	return passport;
}

module.exports = init();
