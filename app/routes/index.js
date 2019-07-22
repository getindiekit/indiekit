const express = require('express');
const multer = require('multer');

const admin = require(process.env.PWD + '/app/admin');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const micropub = require(process.env.PWD + '/app/lib/micropub');

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
router.post('/admin',
  indieauth,
  admin
);

// Micropub
router.post('/micropub',
  indieauth,
  files,
  micropub.updatePost,
  micropub.deletePost,
  micropub.undeletePost,
  micropub.createPost
);

router.get('/micropub',
  micropub.query
);

// Media
// Support Sunlit media endpoint, which has a hardcoded URL
// https://github.com/microdotblog/issues/issues/147
router.post('/media(/micropub/media)?',
  indieauth,
  file,
  micropub.createMedia
);

module.exports = router;
