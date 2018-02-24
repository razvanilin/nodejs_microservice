var mongoose = require('mongoose');
var uuid = require('uuid/v1');
var WorkspaceSchema = require('./Workspace');

var CompanySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: function() { return uuid(); },
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    unique: true
  },
  workspaces: [{
    type: WorkspaceSchema,
    required: true
  }]
});

// hook to set the 'name' field automatically
CompanySchema.pre('save', function(next) {
  if (this.displayName) {this.name = this.displayName.toLowerCase();}
  next();
});

// hook to check if the workspace name is unique in the company
CompanySchema.pre('validate', function(next) {
  var workspaces = [];
  for (var i in this.workspaces) {
    if (workspaces.indexOf(this.workspaces[i]) > -1) {
      return next(new Error('Duplicate workspace name'));
    }
  }

  return next();
});

module.exports = CompanySchema;
