const mongoose = require('mongoose');

// Schema of user collection documents
// It's useful for validation and simplify usage of loaded documents
const UserSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  bdate: Date,
  age: { type: Number },
});

// Creating model for `user` collection
// It's providing and interface to mongo functions like: `find`, `create`, etc.
const UserModel = mongoose.model('user', UserSchema);

module.exports = { UserModel };
