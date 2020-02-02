const { validationResult } = require('express-validator');

exports.errorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    return next();
  }
};
