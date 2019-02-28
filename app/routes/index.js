const express = require('express');

const media = require(process.env.PWD + '/app/routes/media');
const micropub = require(process.env.PWD + '/app/routes/micropub');
const router = new express.Router();

// Micropub
router.post('/media', media.post);
router.get('/micropub', micropub.get);
router.post('/micropub', micropub.post);

module.exports = router;
