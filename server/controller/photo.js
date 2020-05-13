const ObjectId = require('mongoose').Types.ObjectId;
const Photo = require('../model/photo');
const Like = require('../model/like');
const Comment = require('../model/comment');

const cloudinary = require('../lib/cloudinary');

const validators = require('./photo.validator');

exports.getPhoto = [
  validators.getPhoto,
  async (req, res) => {
    try {
      const photoId = ObjectId(req.params.photoId);

      const pipeline = [
        { $match: { _id: photoId } },
        {
          $lookup: {
            from: 'users',
            let: { id: '$userId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
              { $project: { username: 1, _id: 1, profilePicUrl: 1 } },
            ],
            as: 'userDetail',
          },
        },
        { $addFields: { user: { $arrayElemAt: ['$userDetail', 0] } } },
        { $project: { userDetail: 0, userId: 0, like: 0 } },
      ];

      const user = req.authUser;
      if (user) {
        pipeline.splice(
          3,
          0,
          {
            $lookup: {
              from: 'likes',
              let: { userId: user._id, photoId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$userId', '$$userId'] },
                        { $eq: ['$photoId', '$$photoId'] },
                      ],
                    },
                  },
                },
                { $project: { _id: 1 } },
              ],
              as: 'like',
            },
          },
          {
            $addFields: {
              isLikedByMe: {
                $cond: {
                  if: {
                    $eq: [{ $size: '$like' }, 0],
                  },
                  then: false,
                  else: true,
                },
              },
            },
          }
        );
      }
      const photo = await Photo.aggregate(pipeline);

      res.json(photo[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];

exports.deletePhoto = [
  validators.deletePhoto,
  async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.photoId);
      if (photo.userId.toString() !== req.user._id.toString()) {
        return res.status(422).send({ msg: 'cannot delete this post' });
      }

      await Promise.all([
        cloudinary.uploader.destroy(photo.cloudinaryPublicId),
        photo.remove(),
      ]);

      res.status(200).send({ msg: 'successfully deleted post' });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];

exports.likePhoto = [
  validators.likePhoto,
  async (req, res) => {
    try {
      // check if user already liked the photo
      const liked = await Like.exists({
        photoId: req.params.photoId,
        userId: req.user._id,
      });

      if (liked) {
        return res.status(422).send('photo is already liked');
      }

      const like = await Like.create({
        photoId: req.params.photoId,
        userId: req.user._id,
      });
      const photo = await Photo.findByIdAndUpdate(
        req.params.photoId,
        {
          $inc: { likeCount: 1 },
        },
        { new: true }
      ).lean();

      res.json({ like: like.toObject(), likeCount: photo.likeCount });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];

exports.unlikePhoto = [
  validators.likePhoto,
  async (req, res) => {
    try {
      const like = await Like.deleteOne({
        photoId: req.params.photoId,
        userId: req.user._id,
      });

      if (!like.deletedCount) {
        return res.status(422).send('photo is not liked');
      }

      await Photo.updateOne(
        { _id: req.params.photoId },
        {
          $inc: { likeCount: -1 },
        }
      ).lean();

      res.end();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];

exports.postComment = [
  validators.postComment,
  async (req, res) => {
    try {
      const comment = await Comment.create({
        userId: req.user._id,
        photoId: req.params.photoId,
        comment: req.body.comment,
      });
      res.json(comment);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];

exports.getComment = [
  validators.getComment,
  async (req, res) => {
    try {
      const { page, size } = req.query;
      const skip = (page - 1) * size;
      const photoId = ObjectId(req.params.photoId);
      const comment = await Comment.aggregate([
        { $match: { photoId } },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: size },
        {
          $lookup: {
            from: 'users',
            let: { id: '$userId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
              { $project: { username: 1, _id: 1, profilePicUrl: 1 } },
            ],
            as: 'userDetail',
          },
        },
        { $addFields: { user: { $arrayElemAt: ['$userDetail', 0] } } },
        { $project: { userDetail: 0, userId: 0, __v: 0 } },
      ]);

      res.json(comment);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];
