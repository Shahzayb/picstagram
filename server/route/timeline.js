const express = require('express');
const controller = require('../controller/timeline');
const auth = require('../middleware/authenticate');

const router = express.Router();

// get timeline with pagination
router.get('/', auth, controller.getTimeline);

module.exports = router;
