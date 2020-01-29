/**
 * Custom .env cofiguration
 */
exports.setup = env => {
  if (env === 'development') {
    const path = require('path');
    require('dotenv').config({ path: path.join(__dirname, 'dev.env') });
  }
};
