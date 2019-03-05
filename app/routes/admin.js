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
    const {body} = request;

    // Ensure token is verified and provides permissions
    const accessToken = request.headers.authorization || body.access_token;
    const authResponse = await indieauth.verifyToken(accessToken);

    // Determine Admin action
    const {query} = request;
    if (query.purge === 'cache' && authResponse) {
      cache.delete();
      return utils.success();
    }

    return utils.error('not_found');
  };

  try {
    const result = await getResult(request);
    return response.status(result.code).set({
      location: result.location || null
    }).json(result.body);
  } catch (error) {
    console.error(error);
  }
};
