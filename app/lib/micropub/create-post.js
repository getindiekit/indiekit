const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const savePost = require('./save-post');

/**
 * Creates a post
 *
 * @memberof micropub
 * @module createPost
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Promise} Express response object
 */
module.exports = [
  auth.scope('create'),
  async (req, res, next) => {
    const {body, files} = req;

    // Normalise form-encoded requests as mf2 JSON
    let mf2 = body;
    if (!req.is('json')) {
      mf2 = microformats.formEncodedToMf2(body);
      logger.info('micropub.createPost: Normalised form-encoded mf2', {mf2});
    }

    try {
      const {pub} = req.app.locals;
      const location = await savePost(pub, mf2, files);

      if (location) {
        logger.info('micropub.createPost: %s', location);
        res.header('Location', location);
        return res.status(202).json({
          success: 'create_pending',
          success_description: `Post will be created at ${location}`
        });
      }
    } catch (error) {
      logger.error('micropub.createPost', {error});
      return res.status(500).json({
        error: 'server_error',
        error_description: `Unable to create post. ${error.message}`
      });
    }

    return next();
  }
];
