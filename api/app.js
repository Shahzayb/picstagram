const express = require('express');

// require middlewares
const logger = require('morgan');

// require routes
const userRoute = require('./routes/user');

/**
 * Custom .env cofiguration
 */
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

// connect to database
require('./utils/db');

const app = express();

// mount middlewares
app.use(logger('combined'));
app.use(express.json());

// mount routes
app.use('/api/user', userRoute);

// start the server
const PORT = process.env.PORT || '5000';

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
