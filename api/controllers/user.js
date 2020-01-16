const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const User = require('../models/user');
const validators = require('./user.validator');
const { createToken } = require('../utils/jwt');

exports.postUser = [
  validators.postUser,
  async (req, res) => {
    try {
      const [password, profilePicUrl, token] = await Promise.all([
        bcrypt.hash(req.body.password, 8),
        gravatar.url(req.body.email),
        createToken(req.body.username)
      ]);

      const user = await User.create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password,
        profilePicUrl
      });

      console.log(user);

      res.status(201).send({
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
