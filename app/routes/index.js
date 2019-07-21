const express = require('express');
const multer = require('multer');

const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const adminRoutes = require(process.env.PWD + '/app/routes/admin');
const micropubRoutes = require(process.env.PWD + '/app/routes/micropub');

const router = new express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

const file = upload.single('file');
const files = upload.any();

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
router.post('/media', indieauth, file, micropub.createMedia);
router.post('/micropub', indieauth, files, micropubRoutes.post);
router.get('/micropub', micropub.query);

// Support Sunlit, which has a hardcoded media endpoint URL
// https://github.com/microdotblog/issues/issues/147
router.post('/media/micropub/media', indieauth, micropub.createMedia);

module.exports = router;
