const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const cache = require(process.env.PWD + '/app/lib/cache');

/**
 *  Middleware function for admin operations
 *
 * @memberof admin
 * @module admin
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Object} Express response
 */

module.exports = [
  indieauth.checkScope('delete'),
  async (req, res) => {
    const {query} = req;
    switch (query.cache) {
      // Flush cache
      case 'flush': {
        cache.cache.flushAll();
        return res.json({
          success: 'delete',
          success_description: 'Cache flushed'
        });
      }

      // Return list of cache keys
      case 'keys': {
        return res.json(cache.cache.keys());
      }

      // Return cache statistics
      case 'stats': {
        return res.json(cache.cache.getStats());
      }

      default: {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Request is missing required parameter, or there was a problem with value of one of the parameters provided'
        });
      }
    }
  }
];
