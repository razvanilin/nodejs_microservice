var mongoose = require('mongoose');
var BaseController = require('./BaseController');
var CompanySchema = require('../models/Company');

function CompanyController() {
  var companyModel = mongoose.model('company', CompanySchema);
  BaseController.call(this, companyModel, '_id');
}

CompanyController.prototype = Object.create(BaseController.prototype);
CompanyController.prototype.contructor = CompanyController;

CompanyController.prototype.test = function() {
  return {success: true};
};

module.exports = CompanyController;
