const express = require('express');

const router = express.Router();

// get my account info
router.get('/', (req, res) => res.end());

// get some user by :username
router.get('/:username', (req, res) => res.end());

// get pictures of a user with pagination
router.get('/:username/photos', (req, res) => res.end());

// get suggested users ( i.e. to follow )
router.get('/:username/suggestion', (req, res) => res.end());

module.exports = router;
