const express = require('express');
const app = express();

// require middlewares
const logger = require('morgan');
const compression = require('compression');

const env = app.get('env');
// setup dev environment
require('./config/dev').setup(env);

// require routes
const userRoute = require('./route/user');
const photoRoute = require('./route/photo');
const commentRoute = require('./route/comment');
const timelineRoute = require('./route/timeline');
const cloudinaryRoute = require('./route/cloudinary');

// mount middlewares
app.use(logger('combined'));
app.use(express.json());
app.use(compression());

// mount routes
app.use('/api/user', userRoute);
app.use('/api/photo', photoRoute);
app.use('/api/comment', commentRoute);
app.use('/api/timeline', timelineRoute);
app.use('/api/cloudinary', cloudinaryRoute);

module.exports = app;
