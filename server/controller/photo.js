const Photo = require('../model/photo');
const Like = require('../model/like');
const Comment = require('../model/comment');

const validators = require('./photo.validator');

exports.getPhoto = [
  validators.getPhoto,
  async (req, res) => {
    try {
      const photo = await Photo.findOne({ _id: req.params.photoId }).lean();
      res.json(photo);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

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

exports.postComment = [
  validators.postComment,
  async (req, res) => {
    try {
      const comment = await Comment.create({
        userId: req.user._id,
        photoId: req.params.photoId,
        comment: req.body.comment
      });
      res.json(comment);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.getComment = [
  validators.getComment,
  async (req, res) => {
    try {
      const { page, size } = req.query;
      const skip = (page - 1) * size;
      const comment = await Comment.aggregate([
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: size },
        {
          $lookup: {
            from: 'users',
            let: { id: '$userId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
              { $project: { username: 1, _id: 1, profilePicUrl: 1 } }
            ],
            as: 'userDetail'
          }
        },
        { $addFields: { user: { $arrayElemAt: ['$userDetail', 0] } } },
        { $project: { userDetail: 0, userId: 0, __v: 0 } }
      ]);

      res.json(comment);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
