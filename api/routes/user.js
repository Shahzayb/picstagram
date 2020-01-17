const express = require('express');
const controller = require('../controllers/user');
const auth = require('../middlewares/authenticate');

const router = express.Router();

// register account
router.post('/', controller.postUser);

// login user
router.post('/login', controller.loginUser);

// get my account info
router.get('/', auth, controller.getMyProfile);

// update my account
router.patch('/', auth, (req, res) => res.end());

// get some user by :username
router.get('/:username', (req, res) => res.end());

// get pictures of a user with pagination
router.get('/:username/photos', (req, res) => res.end());

// get suggested users ( i.e. to follow )
router.get('/:username/suggestion', (req, res) => res.end());

module.exports = router;
