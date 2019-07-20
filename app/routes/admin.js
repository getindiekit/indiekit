const cache = require(process.env.PWD + '/app/lib/cache');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
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

    // Verify access token
    const accessToken = request.headers.authorization;
    const authResponse = await indieauth.verifyToken(accessToken);
    const authError = authResponse.body && authResponse.body.error;

    // Return any errors from IndieAuth token endpoint
    if (authError) {
      return authResponse;
    }

    // Ensure token provides enough scope
    const {scope} = authResponse;
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
