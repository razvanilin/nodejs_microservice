var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var _ = require('lodash');

var routes = require('./routes/index');

module.exports = function(settings, cb) {
  var app = express();

  app.settings = settings;
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride('X-HTTP-Method-Override'));

  app.use(cors());

  app.get('/', function(req, res) {
    return res.send('Welcome to the API');
  });

  // Connect to mongodb
  mongoose.connect(settings.dbhost);
  return mongoose.connection.once('open', function() {
    // Load the routes
    _.each(routes, function(controller, route) {
      app.use(route, controller(app, route));
    });

    app = app.listen(settings.port, function() {
      // console.log('Running server on port ' + settings.port);
    });

    return cb({
      app: app,
      db: mongoose.connection.db
    });
  });
};
