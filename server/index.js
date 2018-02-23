const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const _ = require('lodash');

var app = express();
var http = require("http").Server(app);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cors());

// Connect to mongodb
var mongoDB = mongoose.connect(app.settings.dbhost, {useMongoClient: true});
mongoose.connection.once('open', function() {
  // Load the models
  app.models = require('./models/index');

  // Load the routes
  var routes = require('./routes/index');
  _.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
  });

  var server = app.listen(app.settings.port, function() {
    console.log("Running server on port " + app.settings.port);
  });
});
