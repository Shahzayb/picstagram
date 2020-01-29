const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
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
    bio: {
      type: String,
      maxlength: 120
    },
    profilePicUrl: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ],
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
