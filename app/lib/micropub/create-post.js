const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const savePost = require('./save-post');

/**
 * Creates a post
 *
 * @memberof micropub
 * @module createPost
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @returns {Promise} Express response object
 */
module.exports = [
  auth.scope('create'),
  async (request, response) => {
    const {body} = request;
    const {files} = request;
    logger.info('Request body', {body});
    logger.info('Request file(s)', {files});

    // Normalise form-encoded requests as mf2 JSON
    let mf2 = body;
    if (!request.is('json')) {
      mf2 = microformats.formEncodedToMf2(body);
      logger.info('Normalised form-encoded mf2', {mf2});
    }

    try {
      const location = await savePost(mf2, files);

      if (location) {
        logger.info('micropub.createPost %s', location);
        response.header('Location', location);
        return response.status(202).json({
          success: 'create_pending',
          success_description: `Post will be created at ${location}`
        });
      }
    } catch (error) {
      logger.error(error);
      return response.status(500).json({
        error: 'server_error',
        error_description: `Unable to create post. ${error.message}`
      });
    }
  }
];
