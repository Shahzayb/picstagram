const { query } = require('express-validator');
const { errorMiddleware } = require('../util/validator');

const pageQueryValidator = query('page')
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
  .withMessage('page should be a number. and should be greater than 0');

const sizeQueryValidator = query('size')
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
  .withMessage('size should be a number and between 1 and 100');

exports.getTimeline = [pageQueryValidator, sizeQueryValidator, errorMiddleware];
