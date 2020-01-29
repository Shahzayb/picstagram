/**
 * Custom .env cofiguration
 */
exports.setup = env => {
  if (env === 'test') {
    const path = require('path');
    require('dotenv').config({ path: path.join(__dirname, 'test.env') });
  }
};
