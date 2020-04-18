const User = require('../model/user');
const Photo = require('../model/photo');

const validators = require('./timeline.validator');

exports.getTimeline = [
  validators.getTimeline,
  async (req, res) => {
    try {
      const { page, size } = req.query;
      const skip = (page - 1) * size;
      const timeline = await User.aggregate([
        { $match: { username: req.user.username } },
        {
          $project: {
            timelineUsers: { $setUnion: ['$following', [req.user._id]] },
            _id: 0,
          },
        },
        { $unwind: '$timelineUsers' },
        {
          $lookup: {
            from: 'photos',
            localField: 'timelineUsers',
            foreignField: 'userId',
            as: 'timelinePhotos',
          },
        },
        { $project: { timelinePhotos: 1 } },
        { $unwind: '$timelinePhotos' },
        {
          $replaceRoot: {
            newRoot: '$timelinePhotos',
          },
        },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: size },
        {
          $lookup: {
            from: 'likes',
            let: { userId: req.user._id, photoId: '$_id' },
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
        },
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
      ]);

      res.json(timeline);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
];
