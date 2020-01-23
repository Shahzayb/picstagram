const jwt = require('jsonwebtoken');

exports.createToken = data => {
  return jwt.sign(data, process.env.JWT_SECRET);
};
