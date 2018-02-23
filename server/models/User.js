const mongoose = require('mongoose');
const uuid = require('uuid/v1');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["basic", "admin"],
    required: true,
  },
});

module.exports = UserSchema;
