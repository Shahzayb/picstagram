const Photo = require('../model/photo');
const Like = require('../model/like');

const validators = require('./photo.validator');

exports.likePhoto = [
  validators.likePhoto,
  async (req, res) => {
    try {
      // check if user already liked the photo
      const liked = await Like.exists({
        photoId: req.params.photoId,
        userId: req.user._id
      });

      if (liked) {
        return res.status(422).send('photo is already liked');
      }

      const like = await Like.create({
        photoId: req.params.photoId,
        userId: req.user._id
      });
      const photo = await Photo.findByIdAndUpdate(
        req.params.photoId,
        {
          $inc: { likeCount: 1 }
        },
        { new: true }
      ).lean();

      res.json({ like: like.toObject(), likeCount: photo.likeCount });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.unlikePhoto = [
  validators.likePhoto,
  async (req, res) => {
    try {
      const like = await Like.deleteOne({
        photoId: req.params.photoId,
        userId: req.user._id
      });

      if (!like.deletedCount) {
        return res.status(422).send('photo is not liked');
      }

      await Photo.updateOne(
        { _id: req.params.photoId },
        {
          $inc: { likeCount: -1 }
        }
      ).lean();

      res.end();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
