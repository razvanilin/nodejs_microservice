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
    type: String,
    required: true
  },
  users: [{
    type: String,
    ref: 'user'
  }]
});

// hook to set the 'name' field automatically
WorkspaceSchema.pre('save', function(doc) {
  if (doc.displayName) {doc.name = doc.displayName.toLowerCase();}

  return doc;
});

module.exports = WorkspaceSchema;
