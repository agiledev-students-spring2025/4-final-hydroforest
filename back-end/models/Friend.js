const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hydration: { type: Number, required: true },
  src: String
});

module.exports = mongoose.model('Friend', FriendSchema);
