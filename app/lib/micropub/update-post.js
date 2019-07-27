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
  (req, res, next) => {
    const {action} = req.query || req.body;
    return (action === 'update') ? auth.scope('update') : next();
  },
  async (req, res, next) => {
    const {action, url} = req.query || req.body;

    if (action && url) {
      const error_description = 'Update action not supported';
      logger.error('micropub.updatePost: %s', error_description);
      return res.status(400).json({
        error: 'invalid_request',
        error_description
      });
    }

    return next();
  }
];
