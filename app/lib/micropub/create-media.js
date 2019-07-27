const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const saveMedia = require('./save-media');

/**
 * Creates a new media file
 *
 * @memberof micropub
 * @module createMedia
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Promise} Express response object
 */
module.exports = [
  auth.scope('create'),
  async (req, res, next) => {
    const {file} = req;
    const {pub} = req.app.locals;

    if (!file || file.truncated || !file.buffer) {
      logger.error('micropub.createMedia: No files included in request');
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'No files included in request'
      });
    }

    try {
      const location = await saveMedia(pub, file);

      if (location) {
        logger.info('micropub.createMedia: %s', location);
        res.header('Location', location);
        return res.status(201).json({
          success: 'create',
          success_description: `File created at ${location}`
        });
      }
    } catch (error) {
      logger.error('micropub.createMedia', {error});
      return res.status(500).json({
        error: 'server_error',
        error_description: `Unable to create file. ${error.message}`
      });
    }

    return next();
  }
];
