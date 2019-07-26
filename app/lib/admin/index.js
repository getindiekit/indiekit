const auth = require(process.env.PWD + '/app/lib/auth');
const cache = require(process.env.PWD + '/app/lib/cache');

/**
 * Responds to POST requests
 *
 * @memberof admin
 * @module admin
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Object} Express response object
 */

module.exports = [
  auth.scope('delete'),
  async (req, res) => {
    const {query} = req;

    // Ensure request includes query (and for now, that for purging cache)
    const hasQuery = Object.entries(query).length !== 0;
    if (!hasQuery || query.purge !== 'cache') {
      return res.status(404).json({
        error: 'not_found',
        error_description: 'Resource not found'
      });
    }

    if (query.purge === 'cache') {
      cache.delete();
      return res.status(201).json({
        success: 'delete',
        success_description: 'Cache deleted'
      });
    }

    return res.status(500).json({
      error: 'server_error',
      error_description: 'Unable to delete cache'
    });
  }
];
