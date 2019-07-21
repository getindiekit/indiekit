const logger = require(process.env.PWD + '/app/logger');
const hasScope = require('./has-scope');
const saveFile = require('./save-file');

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
  hasScope('create'),
  async (request, response) => {
    const {file} = request;

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
        success: 'server_error',
        success_description: `Unable to create file. ${error.message}`
      });
    }
  }
];
