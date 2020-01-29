const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const User = require('../model/user');
const Photo = require('../model/photo');
const validators = require('./user.validator');
const { createToken } = require('../util/jwt');

exports.postUser = [
  validators.postUser,
  async (req, res) => {
    try {
      const [password, profilePicUrl, token] = await Promise.all([
        bcrypt.hash(req.body.password, 8),
        gravatar.url(req.body.email),
        createToken({ username: req.body.username })
      ]);

      const user = await User.create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password,
        profilePicUrl
      });

      res.status(201).json({
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
          profilePicUrl: user.profilePicUrl
        },
        token
      });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.getMyProfile = (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      bio: req.user.bio,
      profilePicUrl: req.user.profilePicUrl
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

exports.loginUser = [
  validators.loginUser,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username })
        .select('+username +name +email +profilePicUrl')
        .lean();

      if (!user) {
        return res.status(401).send('invalid username or password');
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        res.status(401).send('invalid username or password');
      }

      const token = await createToken({ username });

      res.json({
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
          profilePicUrl: user.profilePicUrl
        },
        token
      });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.updateAccount = [
  validators.updateAccount,
  async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { username: req.user.username },
        {
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          bio: req.body.bio
        },
        { new: true }
      ).lean();

      const token = await createToken({ username: user.username });

      res.json({
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
          profilePicUrl: user.profilePicUrl,
          bio: user.bio
        },
        token
      });
    } catch (e) {
      res.status(500).send();
    }
  }
];

exports.getUserByUsername = [
  validators.getUserByUsername,
  async (req, res) => {
    try {
      const $project = {
        followerCount: { $size: '$follower' },
        followingCount: { $size: '$following' },
        _id: 1,
        username: 1,
        name: 1,
        bio: 1,
        profilePicUrl: 1
      };
      if (req.authUser) {
        $project.isFollowedByMe = { $in: [req.authUser._id, '$follower'] };
      }
      const user = await User.aggregate([
        { $match: { username: req.params.username } },
        {
          $project
        }
      ]);

      res.json(user[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.followUser = [
  validators.followUser,
  async (req, res) => {
    try {
      if (req.user.username === req.params.username) {
        return res
          .status(422)
          .send("follower and followee couldn't be the same user");
      }
      const user = await User.findOneAndUpdate(
        { username: req.params.username },
        { $addToSet: { follower: req.user._id } },
        { new: true }
      ).lean();

      await User.updateOne(
        { _id: req.user._id },
        {
          $addToSet: { following: user._id }
        }
      ).lean();

      res.end();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.unfollowUser = [
  validators.unfollowUser,
  async (req, res) => {
    try {
      if (req.user.username === req.params.username) {
        return res
          .status(422)
          .send("follower and followee couldn't be the same user");
      }
      const user = await User.findOneAndUpdate(
        { username: req.params.username },
        { $pull: { follower: req.user._id } },
        { new: true }
      ).lean();

      await User.updateOne(
        { _id: req.user._id },
        {
          $pull: { following: user._id }
        }
      ).lean();

      res.end();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.photoByUsername = [
  validators.photoByUsername,
  async (req, res) => {
    try {
      const { page, size } = req.query;
      const skip = (page - 1) * size;
      const photos = await Photo.find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(size);
      res.json(photos);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
