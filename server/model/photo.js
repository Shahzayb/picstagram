const mongoose = require('mongoose');
const Like = require('./like');
const Comment = require('./comment');

const PhotoSchema = new mongoose.Schema(
  {
    photoUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 120,
    },
    likeCount: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

PhotoSchema.post('remove', (doc) => {
  return Promise.all([
    Like.deleteMany({ photoId: doc._id }),
    Comment.deleteMany({ photoId: doc._id }),
  ]);
});

const Photo = mongoose.model('photo', PhotoSchema);

module.exports = Photo;
