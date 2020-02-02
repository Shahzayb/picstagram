const { param } = require('express-validator');
const { errorMiddleware } = require('../util/validator');
const Photo = require('../model/photo');

exports.likePhoto = [
  param('photoId')
    .trim()
    .not()
    .isEmpty()
    .custom(_id => {
      return Photo.exists({ _id }).then(exists => {
        if (!exists) {
          Promise.reject('Please enter valid photoId');
        }
      });
    }),
  errorMiddleware
];

exports.unlikePhoto = [
  param('photoId')
    .trim()
    .not()
    .isEmpty()
    .custom(_id => {
      return Photo.exists({ _id }).then(exists => {
        if (!exists) {
          Promise.reject('Please enter valid photoId');
        }
      });
    }),
  errorMiddleware
];
