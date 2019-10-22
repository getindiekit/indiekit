const express = require('express');
const multer = require('multer');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const admin = require(process.env.PWD + '/app/middleware/admin');
const indieauth = require(process.env.PWD + '/app/middleware/auth');
const locals = require(process.env.PWD + '/app/middleware/locals');
const media = require(process.env.PWD + '/app/middleware/media');
const micropub = require(process.env.PWD + '/app/middleware/micropub');

const router = new express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});
const file = upload.single('file');
const files = upload.any();

const auth = indieauth.verifyToken({
  me: config.pub.url
});

// Save application and publication configuration to locals
router.use('/', locals(config));

// Index
router.get('/', (req, res) => {
  res.render('index');
});

// Admin
router.post('/admin',
  auth,
  admin
);

// Media
router.get('/media',
  media.query
);

router.post('/media',
  auth,
  file,
  media.upload
);

// Micropub
router.get('/micropub',
  micropub.query
);

router.post('/micropub',
  auth,
  files,
  micropub.action,
  micropub.create
);

// Error (for testing)
router.get('/teapot', (req, res, next) => {
  return next(new IndieKitError({
    status: 418,
    error: 'Teapot',
    error_description: 'I’m a teapot',
    error_uri: 'https://tools.ietf.org/html/rfc2324'
  }));
});

module.exports = router;
