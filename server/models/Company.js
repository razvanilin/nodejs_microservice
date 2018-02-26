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

  // for (var i = 0; i < this.workspaces.length - 1; i++) {
  //   for (var j = i + 1; j < this.workspaces.length; j++) {
  //     if (this.workspaces[i].toLowerCase() === this.workspaces[j].toLowerCase()) {
  //       return next(new Error('Duplicate workspace name'));
  //     }
  //   }
  // }

  next();
});

// hook to check if the workspace name is unique in the company
CompanySchema.pre('validate', function(next) {
  if (this.workspaces.length === 0) return next();

  for (var i = 0; i < this.workspaces.length - 1; i++) {
    for (var j = i + 1; j < this.workspaces.length; j++) {
      if (this.workspaces[i].displayName.toLowerCase() === this.workspaces[j].displayName.toLowerCase()) {
        return next(new Error('Duplicate workspace name'));
      }
    }
  }

  return next();
});

module.exports = CompanySchema;
