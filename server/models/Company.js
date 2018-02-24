var mongoose = require('mongoose');
var uuid = require('uuid/v1');

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
    type: String,
    ref: 'workspace'
  }]
});

// hook to set the 'name' field automatically
CompanySchema.pre('save', function(next) {
  if (this.displayName) {this.name = this.displayName.toLowerCase();}
  next();
});

module.exports = CompanySchema;
