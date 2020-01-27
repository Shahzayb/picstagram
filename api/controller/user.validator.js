const { body, param, validationResult } = require('express-validator');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

const errorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    return next();
  }
};

exports.postUser = [
  [
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('username should not be empty')
      .customSanitizer(username => username.toLowerCase())
      .custom(username => {
        return User.exists({ username }).then(exist => {
          if (exist) {
            throw new Error();
          }
          return true;
        });
      })
      .withMessage('username already taken, please enter some other username'),
    body('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('name should not be empty')
      .customSanitizer(name => name.toLowerCase()),
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('please enter email address')
      .customSanitizer(email => email.toLowerCase())
      .isEmail()
      .withMessage('please enter valid email')
      .custom((email /*, { req }*/) => {
        return User.exists({ email }).then(exist => {
          if (exist) {
            throw new Error();
          }
          return true;
        });
      })
      .withMessage(
        'account with this email already exists. please enter some other email address'
      ),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('please enter password')
      .isLength({ min: 8 })
      .withMessage('please enter password with at least 8 character')
  ],
  errorMiddleware
];

exports.loginUser = [
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter username')
    .customSanitizer(username => username.toLowerCase()),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please enter password'),
  errorMiddleware
];

exports.updateAccount = [
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter username')
    .customSanitizer(username => username.toLowerCase())
    .custom((username, { req }) => {
      return User.exists({ username }).then(exist => {
        if (!exist) {
          return Promise.resolve(true);
        } else if (exist && username === req.user.username) {
          return Promise.resolve(true);
        }
        return Promise.reject(
          'Username is already taken. Please enter some other username'
        );
      });
    }),
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter name')
    .customSanitizer(name => name.toLowerCase()),
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter email')
    .customSanitizer(email => email.toLowerCase())
    .isEmail()
    .withMessage('please enter valid email')
    .custom((email, { req }) => {
      return User.exists({ email }).then(exist => {
        if (!exist) {
          return Promise.resolve(true);
        } else if (exist && email === req.user.email) {
          return Promise.resolve(true);
        }
        return Promise.reject(
          'email is already taken. Please enter some other email'
        );
      });
    }),
  body('bio').trim(),
  errorMiddleware
];

exports.getUserByUsername = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .custom(username => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username, { req }) => {
      return User.exists({ username }).then(exist => {
        if (!exist) {
          return Promise.reject('user does not exists');
        }
        return true;
      });
    }),
  errorMiddleware,
  // extract Authorization header if exists and pass doc of authenticated user
  async (req, res, next) => {
    try {
      if (!req.header('Authorization')) {
        return;
      }
      const token = req.header('Authorization').replace('Bearer ', '');
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (req.params.username === verifiedToken.username) {
        return;
      }

      const user = await User.findOne(
        {
          username: verifiedToken.username
        },
        { username: 1 }
      ).lean();

      if (!user) {
        return;
      }

      req.authUser = user;
    } catch (e) {
      console.log(e);
    } finally {
      next();
    }
  }
];

exports.followUser = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .custom(username => username.toLowerCase())
    .withMessage('please enter username')
    .custom(username => {
      return User.exists({ username }).then(exist => {
        if (!exist) {
          return Promise.reject('user does not exist');
        }
        return true;
      });
    }),
  errorMiddleware
];

exports.unfollowUser = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .custom(username => username.toLowerCase())
    .withMessage('please enter username')
    .custom(username => {
      return User.exists({ username }).then(exist => {
        if (!exist) {
          return Promise.reject('user does not exist');
        }
        return true;
      });
    }),
  errorMiddleware
];
