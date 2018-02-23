var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var _ = require('lodash');

var models = require('./models/index');
var routes = require('./routes/index');

var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cors());

// Connect to mongodb
mongoose.connect(app.settings.dbhost, {useMongoClient: true});
mongoose.connection.once('open', function() {
  // Load the models
  app.models = models;

  // Load the routes
  _.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
  });

  app.listen(app.settings.port, function() {
    console.log('Running server on port ' + app.settings.port);
  });
});
