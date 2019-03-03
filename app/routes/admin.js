const config = require(process.env.PWD + '/app/config');
const cache = require(process.env.PWD + '/app/lib/cache');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const micropub = require(process.env.PWD + '/app/lib/micropub');

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
exports.post = async (request, response, next) => {
  const getPostResponse = async request => {
    const {body} = request;

    // Verify access token
    const accessToken = request.headers.authorization || body.access_token;
    const verifiedToken = await indieauth.verifyToken(accessToken, config.url);
    if (!verifiedToken) {
      return micropub.error('forbidden', 'Unable to verify access token');
    }

    // Authorized users can purge cache
    const {query} = request;
    if (query.purge === 'cache') {
      cache.delete();
      return micropub.response();
    }

    return micropub.error('not_found');
  };

  try {
    const postResponse = await getPostResponse(request);
    return response.status(postResponse.code).json(postResponse.body);
  } catch (error) {
    console.error(error);
  }

  next();
};
