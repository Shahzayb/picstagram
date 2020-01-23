const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const User = require('../model/user');
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

      console.log(user);

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
        followersCount: { $size: '$followers' },
        followingCount: { $size: '$following' },
        _id: 1,
        username: 1,
        name: 1,
        bio: 1,
        profilePicUrl: 1
      };
      if (req.authUser) {
        $project.isFollowedByMe = { $in: [req.authUser._id, '$followers'] };
      }
      const user = await User.aggregate([
        { $match: { username: req.params.username } },
        {
          $project
        }
      ]);

      console.log(user);

      res.json(user[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
