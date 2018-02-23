const mongoose = require('mongoose');
const uuid = require('uuid/v1');

var CompanySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => return uuid(),
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  workspaces: [{
    type: String,
    ref: "workspace",
  }],
});

// hook to set the 'name' field automatically
CompanySchema.pre("save", (doc) => {
  if (doc.displayName)
    doc.name = doc.displayName.toLowerCase();

  return doc;
});

module.exports = CompanySchema;
