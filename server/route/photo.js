const express = require('express');
const controller = require('../controller/photo');
const auth = require('../middleware/authenticate');

const router = express.Router();

// like photo
router.patch('/:photoId/like', auth, controller.likePhoto);

// unlike photo
router.patch('/:photoId/unlike', auth, controller.unlikePhoto);

// delete photo
router.delete('/:photoId', auth, (req, res) => res.end());

// post comment on photo
router.post('/:photoId/comment', auth, (req, res) => res.end());

// get comments of a photo with pagination
router.get('/:photoId/comment', (req, res) => res.end());

module.exports = router;
