const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  bdate: Date,
  age: { type: Number },
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = { UserModel };
