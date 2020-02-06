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
        { $project: { following: 1, _id: 0 } },
        { $unwind: '$following' },
        {
          $lookup: {
            from: 'photos',
            localField: 'following',
            foreignField: 'userId',
            as: 'timelinePhotos'
          }
        },
        { $project: { timelinePhotos: 1 } },
        { $unwind: '$timelinePhotos' },
        {
          $replaceRoot: {
            newRoot: '$timelinePhotos'
          }
        },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: size }
      ]);

      res.json(timeline);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
