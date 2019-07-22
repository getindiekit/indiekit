const auth = require(process.env.PWD + '/app/lib/auth');
const cache = require(process.env.PWD + '/app/lib/cache');

/**
 * Responds to POST requests
 *
 * @memberof admin
 * @module admin
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @returns {Object} Express response object
 */

module.exports = [
  (request, response, next) => {
    const {action} = request.query || request.body;
    if (action === 'update') {
      return auth.scope('delete')(request, response, next);
    }

    return next();
  },
  async (request, response) => {
    const {query} = request;

    // Ensure request includes query (and for now, that for purging cache)
    const hasQuery = Object.entries(query).length !== 0;
    if (!hasQuery || query.purge !== 'cache') {
      return response.status(404).json({
        error: 'not_found',
        error_description: 'Resource not found'
      });
    }

    if (query.purge === 'cache') {
      cache.delete();
      return response.status(201).json({
        success: 'delete',
        success_description: 'Cache deleted'
      });
    }

    return response.status(500).json({
      error: 'server_error',
      error_description: 'Unable to delete cache'
    });
  }
];
