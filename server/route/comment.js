const express = require('express');
const controller = require('../controller/comment');
const auth = require('../middleware/authenticate');

const router = express.Router();

// delete comment by id
router.delete('/:commentId', auth, controller.deleteComment);

module.exports = router;
