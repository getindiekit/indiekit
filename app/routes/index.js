const express = require('express');

const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const adminRoutes = require(process.env.PWD + '/app/routes/admin');
const mediaRoutes = require(process.env.PWD + '/app/routes/media');
const micropubRoutes = require(process.env.PWD + '/app/routes/micropub');

const router = new express.Router();

/**
 * @module routes
 */

// Index
router.get('/', (request, response) => {
  response.render('index');
});

// Admin
router.post('/admin', indieauth, adminRoutes.post);

// Micropub
router.post('/media', indieauth, mediaRoutes.post);
router.post('/micropub', indieauth, micropubRoutes.post);
router.get('/micropub', micropub.query);

// Support Sunlit, which has a hardcoded media endpoint URL
// https://github.com/microdotblog/issues/issues/147
router.post('/media/micropub/media', indieauth, mediaRoutes.post);

module.exports = router;
