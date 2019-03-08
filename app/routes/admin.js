const cache = require(process.env.PWD + '/app/lib/cache');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
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
  const getResult = async request => {
    // Determine admin action, ensuring token is verified and provides scope
    const accessToken = request.headers.authorization;
    const authResponse = await indieauth.verifyToken(accessToken);
    const {scope} = authResponse;
    const {query} = request;

    if (!scope) {
      return authResponse;
    }

    if (scope.includes('delete') && query.purge === 'cache') {
      cache.delete();
      return utils.success();
    }

    return utils.error('not_found');
  };

  try {
    const result = await getResult(request);
    return response.status(result.code).json(result.body);
  } catch (error) {
    console.error(error);
  }
};
