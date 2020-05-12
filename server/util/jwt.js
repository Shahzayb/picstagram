const jwt = require('jsonwebtoken');

exports.createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET);
};

// `secret` is passwordHash concatenated with user's
// createdAt value, so if someone malicious gets the
// token they still need a timestamp to hack it:
exports.createTokenForResetPassword = ({
  password: passwordHash,
  _id: userId,
  createdAt,
}) => {
  const secret = passwordHash + '-' + createdAt;
  const token = jwt.sign({ userId }, secret, {
    expiresIn: 3600, // 1 hour
  });

  return token;
};
