const express = require('express');
const logger = require('morgan');

/**
 * Custom .env cofiguration
 */
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

// connect to database
require('./db/index');

const app = express();

app.use(logger('combined'));

app.get('/', (req, res) => {
  res.send('hello');
});

const PORT = process.env.PORT || '5000';

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
