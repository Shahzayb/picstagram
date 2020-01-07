const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },
  profilePicUrl: {
    type: String,
    required: true
  },
  follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
