var mongoose = require('mongoose');
var uuid = require('uuid/v1');

var WorkspaceSchema = new mongoose.Schema({
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
    type: String
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
});

// hook to set the 'name' field automatically
WorkspaceSchema.pre('save', function(next) {
  if (this.displayName) {this.name = this.displayName.toLowerCase();}
  next();
});

module.exports = WorkspaceSchema;
