const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module updatePost
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Object} Express response object
 */
module.exports = [
  auth.scope('update'),
  (req, res, next) => {
    const {action} = req.query || req.body;
    return (action === 'update') ? auth.scope('update') : next();
  },
  async (req, res, next) => {
    const {action, url} = req.query || req.body;

    if (action && url) {
      logger.info('micropub.updatePost: %s', url);
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'Update action not supported'
      });
    }

    return next();
  }
];
