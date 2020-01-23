const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'photo',
    required: true
  }
});

const Like = mongoose.model('like', LikeSchema);

module.exports = Like;
