const auth = require(process.env.PWD + '/app/lib/auth');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module updatePost
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @returns {Object} Express response object
 */
module.exports = [
  auth.scope('update'),
  (request, response, next) => {
    const {action} = request.query || request.body;
    return (action === 'update') ? auth.scope('update') : next();
  },
  async (request, response, next) => {
    const {action, url} = request.query || request.body;

    if (action && url) {
      return response.status(400).json({
        error: 'invalid_request',
        error_description: 'Update action not supported'
      });
    }

    return next();
  }
];
