const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const saveMedia = require('./save-media');

/**
 * Creates a new media file
 *
 * @memberof micropub
 * @module createMedia
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @returns {Promise} Express response object
 */
module.exports = [
  auth.scope('create'),
  async (request, response) => {
    const {file} = request;
    logger.info('Request file', {file});

    if (!file || file.truncated || !file.buffer) {
      return response.status(400).json({
        error: 'invalid_request',
        error_description: 'No files included in request'
      });
    }

    try {
      const location = await saveFile(file);

      if (location) {
        logger.info('micropub.createMedia %s', location);
        response.header('Location', location);
        return response.status(201).json({
          success: 'create',
          success_description: `File created at ${location}`
        });
      }
    } catch (error) {
      logger.error(error);
      return response.status(500).json({
        error: 'server_error',
        error_description: `Unable to create file. ${error.message}`
      });
    }
  }
];
