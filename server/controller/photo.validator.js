const { param, body } = require('express-validator');
const { errorMiddleware } = require('../util/validator');
const Photo = require('../model/photo');

const photoIdParamValidator = param('photoId')
  .trim()
  .not()
  .isEmpty()
  .custom(_id => {
    return Photo.exists({ _id }).then(exists => {
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

exports.getPhoto = [photoIdParamValidator, errorMiddleware];

exports.likePhoto = [photoIdParamValidator, errorMiddleware];

exports.unlikePhoto = [photoIdParamValidator, errorMiddleware];

exports.postComment = [
  photoIdParamValidator,
  commentBodyValidator,
  errorMiddleware
];
