const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    photoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'photo',
      required: true
    },
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 120
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
