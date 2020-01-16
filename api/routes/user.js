const express = require('express');
const controller = require('../controllers/user');

const router = express.Router();

// register account
router.post('/', controller.postUser);

// get my account info
router.get('/', (req, res) => res.end());

// update my account
router.patch('/', (req, res) => res.end());

// get some user by :username
router.get('/:username', (req, res) => res.end());

// get pictures of a user with pagination
router.get('/:username/photos', (req, res) => res.end());

// get suggested users ( i.e. to follow )
router.get('/:username/suggestion', (req, res) => res.end());

module.exports = router;
