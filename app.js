var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash 		= require('connect-flash');

var User = require('./db/models/user');

var helmet = require('helmet');

var routes = require('./routes/index');
var session = require('./session/');
var passport = require('./auth/')

var app = express();
app.use(compression());
app.use(helmet());

var config = require('./config.js');
app.set('config', config);

const mqtt = require('./mqtt.js');
const broker = mqtt(config.mqtt_broker,config.mqtt_main_id);
app.set('mqtt_broker',broker);

// app.set('mqtt_node_base',config.mqtt_node_base);
// app.set('mqtt_shared_base',config.mqtt_shared_base);

const db = require('./db/');
app.set('db',db);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use("/app",[User.isAuthenticated,express.static(path.join(__dirname, 'public'))]);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page not found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
