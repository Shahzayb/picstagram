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
        ref: 'user',
        required: true,
        unique: true
      }
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
      }
    ]
  },
  { timestamps: true }
);

UserSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

UserSchema.virtual('followersCount').get(function() {
  return this.followers.length;
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
