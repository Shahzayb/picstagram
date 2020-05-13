const express = require('express');
const controller = require('../controller/photo');
const auth = require('../middleware/authenticate');

const router = express.Router();

// get photo by id
router.get('/:photoId', controller.getPhoto);

// like photo
router.patch('/:photoId/like', auth, controller.likePhoto);

// unlike photo
router.patch('/:photoId/unlike', auth, controller.unlikePhoto);

// delete photo
router.delete('/:photoId', auth, controller.deletePhoto);

// post comment on photo
router.post('/:photoId/comment', auth, controller.postComment);

// get comments of a photo with pagination
router.get('/:photoId/comment', controller.getComment);

module.exports = router;
