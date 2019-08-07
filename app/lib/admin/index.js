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

    if (query.purge === 'cache') {
      cache.delete();
      return res.status(201).json({
        success: 'delete',
        success_description: 'Cache deleted'
      });
    }

    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'Request is missing required parameter, or there was a problem with value of one of the parameters provided'
    });
  }
];
