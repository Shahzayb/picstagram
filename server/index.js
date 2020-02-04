const express = require('express');

// require middlewares
const logger = require('morgan');

// require routes
const userRoute = require('./route/user');
const photoRoute = require('./route/photo');
const commentRoute = require('./route/comment');

const app = express();

// mount middlewares
app.use(logger('combined'));
app.use(express.json());

// mount routes
app.use('/api/user', userRoute);
app.use('/api/photo', photoRoute);
app.use('/api/comment', commentRoute);

module.exports = app;
