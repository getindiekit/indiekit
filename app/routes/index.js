const express = require('express');

const admin = require(process.env.PWD + '/app/routes/admin');
const config = require(process.env.PWD + '/app/config');
const media = require(process.env.PWD + '/app/routes/media');
const micropub = require(process.env.PWD + '/app/routes/micropub');

const router = new express.Router();

// Index
router.get('/', (request, response) => {
  response.render('index', config);
});

// Admin
router.post('/admin', admin.post);

// Micropub
router.post('/media', media.post);
router.get('/micropub', micropub.get);
router.post('/micropub', micropub.post);

module.exports = router;
