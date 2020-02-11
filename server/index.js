const express = require('express');

// require middlewares
const logger = require('morgan');
const cors = require('cors');

// require routes
const userRoute = require('./route/user');
const photoRoute = require('./route/photo');
const commentRoute = require('./route/comment');
const timelineRoute = require('./route/timeline');

const app = express();

// mount middlewares
app.use(logger('combined'));
app.use(cors());
app.use(express.json());

// mount routes
app.use('/api/user', userRoute);
app.use('/api/photo', photoRoute);
app.use('/api/comment', commentRoute);
app.use('/api/timeline', timelineRoute);

module.exports = app;
