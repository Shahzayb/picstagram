const { param } = require('express-validator');
const { errorMiddleware } = require('../util/validator');
const Comment = require('../model/comment');

const commentIdParamValidator = param('commentId')
  .trim()
  .not()
  .isEmpty()
  .custom(_id => {
    return Comment.exists({ _id }).then(exists => {
      if (!exists) {
        throw new Error();
      }
    });
  })
  .withMessage('Please enter valid comment id');

exports.deleteComment = [commentIdParamValidator, errorMiddleware];
