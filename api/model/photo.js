const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  photoUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    default: '',
    required: true,
    maxlength: 120
  },
  likesCount: {
    type: Number,
    default: 0,
    required: true
  }
});

const Photo = mongoose.model('photo', PhotoSchema);

module.exports = Photo;
