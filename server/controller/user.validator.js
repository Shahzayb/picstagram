const { body, param, query } = require('express-validator');
const { errorMiddleware } = require('../util/validator');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

exports.postUser = [
  [
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('username should not be empty')
      .customSanitizer((username) => username.toLowerCase())
      .custom((username) => {
        return User.exists({ username }).then((exist) => {
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
      .customSanitizer((name) => name.toLowerCase()),
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('please enter email address')
      .isEmail()
      .normalizeEmail()
      .withMessage('please enter valid email')
      .custom((email /*, { req }*/) => {
        return User.exists({ email }).then((exist) => {
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
      .not()
      .isEmpty()
      .withMessage('please enter password')
      .isLength({ min: 8 })
      .withMessage('please enter password with at least 8 character'),
  ],
  errorMiddleware,
];

exports.loginUser = [
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter username')
    .customSanitizer((username) => username.toLowerCase()),
  body('password').not().isEmpty().withMessage('please enter password'),
  errorMiddleware,
];

exports.forgotPassword = [
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please enter email address')
    .isEmail()
    .normalizeEmail()
    .withMessage('please enter valid email')
    .custom((email) => {
      return User.exists({ email }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage(
      'account with this email does not exist. please enter some other email address'
    ),

  errorMiddleware,
];

exports.resetPassword = [
  param('userId')
    .custom((userId) => {
      return User.exists({ _id: userId }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage(
      'account with this userId does not exist. please enter valid userId'
    ),
  body('password')
    .not()
    .isEmpty()
    .withMessage('please enter password')
    .isLength({ min: 8 })
    .withMessage('please enter password with at least 8 character'),
  errorMiddleware,
];

exports.updateAccount = [
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter username')
    .customSanitizer((username) => username.toLowerCase())
    .custom((username, { req }) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          return Promise.resolve(true);
        } else if (exist && username === req.user.username) {
          return Promise.resolve(true);
        }
        throw new Error();
      });
    })
    .withMessage('Username is already taken. Please enter some other username'),
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter name')
    .customSanitizer((name) => name.toLowerCase()),
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter email')
    .normalizeEmail()
    .isEmail()
    .withMessage('please enter valid email')
    .custom((email, { req }) => {
      return User.exists({ email }).then((exist) => {
        if (!exist) {
          return Promise.resolve(true);
        } else if (exist && email === req.user.email) {
          return Promise.resolve(true);
        }
        throw new Error();
      });
    })
    .withMessage('email is already taken. Please enter some other email'),
  body('bio').trim(),
  errorMiddleware,
];

exports.getUserByUsername = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((username) => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username, { req }) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage('user does not exists'),
  errorMiddleware,
  // extract Authorization header if exists and pass doc of authenticated user
  async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');

      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (req.params.username === verifiedToken.username) {
        return;
      }

      const user = await User.findOne(
        {
          username: verifiedToken.username,
        },
        { username: 1 }
      ).lean();

      if (!user) {
        return;
      }

      req.authUser = user;
    } catch (e) {
      console.log('invalid token', e);
    } finally {
      next();
    }
  },
];

exports.followUser = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((username) => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage('user does not exist'),
  errorMiddleware,
];

exports.unfollowUser = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((username) => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage('user does not exist'),
  errorMiddleware,
];

exports.photoByUsername = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((username) => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage('user does not exist'),
  query('page')
    .trim()
    .not()
    .isEmpty()
    .withMessage('page number is required')
    .toInt()
    .custom((page) => {
      if (!isFinite(page) || page < 1) {
        throw new Error();
      }
      return true;
    })
    .withMessage('page should be a number. and should be greater than 0'),
  query('size')
    .trim()
    .not()
    .isEmpty()
    .withMessage('size number is required')
    .toInt()
    .custom((size) => {
      if (!isFinite(size) || size < 1 || size > 100) {
        throw new Error();
      }
      return true;
    })
    .withMessage('size should be a number and between 1 and 100'),
  errorMiddleware,
];

exports.getFollowing = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((username) => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage('user does not exist'),
  query('page')
    .trim()
    .not()
    .isEmpty()
    .withMessage('page number is required')
    .toInt()
    .custom((page) => {
      if (!isFinite(page) || page < 1) {
        throw new Error();
      }
      return true;
    })
    .withMessage('page should be a number. and should be greater than 0'),
  query('size')
    .trim()
    .not()
    .isEmpty()
    .withMessage('size number is required')
    .toInt()
    .custom((size) => {
      if (!isFinite(size) || size < 1 || size > 100) {
        throw new Error();
      }
      return true;
    })
    .withMessage('size should be a number and between 1 and 100'),
  errorMiddleware,
];

exports.getFollower = [
  param('username')
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((username) => username.toLowerCase())
    .withMessage('please enter username')
    .custom((username) => {
      return User.exists({ username }).then((exist) => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage('user does not exist'),
  query('page')
    .trim()
    .not()
    .isEmpty()
    .withMessage('page number is required')
    .toInt()
    .custom((page) => {
      if (!isFinite(page) || page < 1) {
        throw new Error();
      }
      return true;
    })
    .withMessage('page should be a number. and should be greater than 0'),
  query('size')
    .trim()
    .not()
    .isEmpty()
    .withMessage('size number is required')
    .toInt()
    .custom((size) => {
      if (!isFinite(size) || size < 1 || size > 100) {
        throw new Error();
      }
      return true;
    })
    .withMessage('size should be a number and between 1 and 100'),
  errorMiddleware,
];
