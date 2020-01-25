const express = require('express');

// require middlewares
const logger = require('morgan');

// require routes
const userRoute = require('./route/user');

const app = express();

// mount middlewares
app.use(logger('combined'));
app.use(express.json());

// mount routes
app.use('/api/user', userRoute);

module.exports = app;
