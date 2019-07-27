const express = require('express');
const multer = require('multer');

const admin = require(process.env.PWD + '/app/lib/admin');
const auth = require(process.env.PWD + '/app/lib/auth');
const config = require(process.env.PWD + '/app/config');
const micropub = require(process.env.PWD + '/app/lib/micropub');

const router = new express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});
const file = upload.single('file');
const files = upload.any();

const indieauth = auth.indieauth({
  me: config.url
});

// Index
router.get('/', (req, res) => {
  res.render('index');
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
