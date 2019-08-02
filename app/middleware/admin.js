const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const auth = require(process.env.PWD + '/app/middleware/auth');
const cache = require(process.env.PWD + '/lib/cache');

/**
 *  Middleware function for admin operations
 *
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback function
 * @returns {Object} Express response
 */
module.exports = [
  auth.checkScope('delete'),
  async (req, res, next) => {
    const {query} = req;
    switch (query.cache) {
      // Flush cache
      case 'flush': {
        cache.flushAll();
        return res.json({
          success: 'delete',
          success_description: 'Cache flushed'
        });
      }

      // Return list of cache keys
      case 'keys': {
        return res.json(cache.keys());
      }

      // Return value of cache key
      case 'key': {
        const {key} = query;
        try {
          const value = cache.get(key, true);
          return res.json(value);
        } catch (error) {
          return next(new IndieKitError({
            status: 404,
            error: 'Not found',
            error_description: error.message
          }));
        }
      }

      // Return cache statistics
      case 'stats': {
        return res.json(cache.getStats());
      }

      default: {
        return next(new IndieKitError({
          status: 400,
          error: 'Invalid request',
          error_description: 'Request is missing required parameter, or there was a problem with value of one of the parameters provided'
        }));
      }
    }
  }
];
