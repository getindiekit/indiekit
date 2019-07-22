const hasScope = require('./has-scope');

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
  (request, response, next) => {
    const {action} = request.query || request.body;
    if (action === 'update') {
      return hasScope('update')(request, response, next);
    }

    return next();
  },
  async (request, response) => {
    return response.status(400).json({
      error: 'invalid_request',
      error_description: 'Update action not supported'
    });
  }
];
