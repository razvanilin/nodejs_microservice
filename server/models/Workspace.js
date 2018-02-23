const mongoose = require('mongoose');
const uuid = require('uuid/v1');

var WorkspaceSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => return uuid(),
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: String,
    ref: "user",
  }],
});

// hook to set the 'name' field automatically
WorkspaceSchema.pre("save", (doc) => {
  if (doc.displayName)
    doc.name = doc.displayName.toLowerCase();

  return doc;
});

module.exports = WorkspaceSchema;
