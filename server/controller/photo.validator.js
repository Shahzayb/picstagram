const { param, body, query } = require('express-validator');
const { errorMiddleware } = require('../util/validator');
const Photo = require('../model/photo');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

const photoIdParamValidator = param('photoId')
  .trim()
  .not()
  .isEmpty()
  .custom((_id) => {
    return Photo.exists({ _id }).then((exists) => {
      if (!exists) {
        throw new Error();
      }
    });
  })
  .withMessage('Please enter valid photo id');

const commentBodyValidator = body('comment')
  .trim()
  .isLength({ min: 1, max: 120 })
  .withMessage('comment should be >= 1 character and <= 120 characters');

const pageQueryValidator = query('page')
  .trim()
  .not()
  .isEmpty()
  .withMessage('page number is required')
  .toInt()
  .custom((page) => {
    if (page < 1) {
      throw new Error();
    }
    return true;
  })
  .withMessage('page should be a number. and should be greater than 0');

const sizeQueryValidator = query('size')
  .trim()
  .not()
  .isEmpty()
  .withMessage('size number is required')
  .toInt()
  .custom((size) => {
    if (size < 1 || size > 100) {
      throw new Error();
    }
    return true;
  })
  .withMessage('size should be a number and between 1 and 100');

exports.getPhoto = [
  photoIdParamValidator,
  errorMiddleware, // extract Authorization header if exists and pass doc of authenticated user
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

exports.likePhoto = [photoIdParamValidator, errorMiddleware];

exports.unlikePhoto = [photoIdParamValidator, errorMiddleware];

exports.postComment = [
  photoIdParamValidator,
  commentBodyValidator,
  errorMiddleware,
];

exports.getComment = [
  photoIdParamValidator,
  pageQueryValidator,
  sizeQueryValidator,
  errorMiddleware,
];
