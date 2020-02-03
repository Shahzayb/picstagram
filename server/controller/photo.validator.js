const { param } = require('express-validator');
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

exports.getPhoto = [photoIdParamValidator, errorMiddleware];

exports.likePhoto = [photoIdParamValidator, errorMiddleware];

exports.unlikePhoto = [photoIdParamValidator, errorMiddleware];
