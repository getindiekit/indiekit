const express = require('express');

const micropub = require(__basedir + '/app/routes/micropub');
const router = new express.Router();

// Micropub
router.get('/micropub', micropub.get);
router.post('/micropub', micropub.post);

module.exports = router;
