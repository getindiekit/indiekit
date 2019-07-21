const cache = require(process.env.PWD + '/app/lib/cache');
const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Responds to POST requests
 *
 * @memberof routes
 * @module admin.post
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Callback
 * @return {Object} HTTP response
 */
exports.post = async (request, response) => {
  logger.info('%s %s', request.method, request.originalUrl);

  const getResult = async request => {
    const {query} = request;

    // Ensure request includes query (and for now, that for purging cache)
    const hasQuery = Object.entries(query).length !== 0;
    if (!hasQuery || query.purge !== 'cache') {
      return utils.error('not_found');
    }

    // Ensure token provides enough scope
    const {scope} = config.indieauth.token;
    const hasScope = scope && scope.length > 0;

    if (hasScope && (scope.includes('delete') && query.purge === 'cache')) {
      cache.delete();
      return utils.success();
    }

    return utils.error('insufficient_scope');
  };

  try {
    const result = await getResult(request);
    return response.status(result.code).json(result.body);
  } catch (error) {
    logger.error(error);
  }
};
