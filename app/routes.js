const express = require('express');

const router = new express.Router();
const micropub = require(__basedir + '/app/routes/micropub');

// Micropub
router.get('/micropub', micropub.get);
router.post('/micropub', micropub.post);

module.exports = router;
