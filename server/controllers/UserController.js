var mongoose = require('mongoose');
var BaseController = require('./BaseController');
var UserSchema = require('../models/User');

function UserController() {
  var userModel = mongoose.model('user', UserSchema);
  BaseController.call(this, userModel, 'email');
}

UserController.prototype = Object.create(BaseController.prototype);
UserController.prototype.contructor = UserController;

module.exports = UserController;
