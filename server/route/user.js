const express = require('express');
const controller = require('../controller/user');
const auth = require('../middleware/authenticate');

const router = express.Router();

// register account
router.post('/', controller.postUser);

// login user
router.post('/login', controller.loginUser);

router.post('/forgot-password', controller.forgotPassword);

router.post('/:userId/reset-password/', controller.resetPassword);

// get my account info
router.get('/', auth, controller.getMyProfile);

// update my account
router.patch('/', auth, controller.updateAccount);

// get some user by :username
router.get('/:username', controller.getUserByUsername);

// follow user
router.patch('/:username/follow', auth, controller.followUser);

// unfollow user
router.patch('/:username/unfollow', auth, controller.unfollowUser);

// get followers of some user with pagination
router.get('/:username/follower', controller.getFollower);

// get followings of some user with pagination
router.get('/:username/following', controller.getFollowing);

// get pictures of a user with pagination
router.get('/:username/photo', controller.photoByUsername);

// get suggested users ( i.e. to follow )
router.get('/:username/suggestion', auth, controller.getUserSuggestions);

module.exports = router;
