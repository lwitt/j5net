'use strict';

var session 	= require('express-session');
var MongoStore	= require('connect-mongo')(session);
var db 		= require('../db');
var config 		= require('../config');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
var init = function () {
	if(process.env.NODE_ENV === 'production') {
		return session({
			secret: config.sessionSecret,
			resave: false,
			saveUninitialized: false,
			unset: 'destroy',
			store: new MongoStore({ mongooseConnection: db.Mongoose.connection }),
			cookie: {
				maxAge: 	1000*60*60*24*60,
				secure : 	true
			}
		});
	} else {
		return session({
			secret: config.sessionSecret,
			resave: false,
			unset: 'destroy',
			saveUninitialized: true,
			cookie: {
				maxAge: 	1000*60*60*24*60,
				secure:	true
			}
		});
	}
}

module.exports = init();
