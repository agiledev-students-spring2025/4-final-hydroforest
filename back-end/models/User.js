const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hydration: { type: Number, required: true },
  src: String
});

module.exports = mongoose.model('User', UserSchema);
