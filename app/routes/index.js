const express = require('express');

const admin = require(process.env.PWD + '/app/routes/admin');
const media = require(process.env.PWD + '/app/routes/media');
const micropub = require(process.env.PWD + '/app/routes/micropub');

const router = new express.Router();

/**
 * @module routes
 */

// Index
router.get('/', (request, response) => {
  response.render('index');
});

// Admin
router.post('/admin', admin.post);

// Micropub
router.post('/media', media.post);
router.get('/micropub', micropub.get);
router.post('/micropub', micropub.post);

// Support Sunlit, which has a hardcoded media endpoint URL
// https://github.com/microdotblog/issues/issues/147
router.post('/media/micropub/media', media.post);

module.exports = router;
