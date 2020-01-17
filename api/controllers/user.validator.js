const { body, validationResult } = require('express-validator');
const User = require('../models/user');

const errorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
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
      .isEmail()
      .normalizeEmail()
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
    .withMessage('Please enter username'),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please enter password'),
  errorMiddleware
];
