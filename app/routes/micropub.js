/**
 * @module routes/micropub
 */
const config = require(__basedir + '/app/functions/config');
const indieauth = require(__basedir + '/app/functions/indieauth');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Responds to GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 */
exports.get = async (request, response) => {
  const pubConfig = await config();
  const appUrl = `${request.protocol}://${request.headers.host}`;
  const getResponse = await micropub.queryResponse(request.query, pubConfig, appUrl);

  return response.status(getResponse.code).json(getResponse.body);
};

/**
 * Responds to POST requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Callback
 * @return {Object} HTTP response
 */
exports.post = async (request, response, next) => {
  const pubConfig = await config();
  const getPostResponse = async request => {
    let {body} = request;

    // Ensure response has body data
    const hasBody = Object.entries(body).length !== 0;
    if (!hasBody) {
      return micropub.errorResponse('invalid_request');
    }

    // Ensure token is provided
    const accessToken = request.headers.authorization || body.access_token;
    if (!accessToken) {
      return micropub.errorResponse('unauthorized');
    }

    // Verify token
    const verifiedToken = await indieauth.verifyToken(accessToken, pubConfig.url);
    if (!verifiedToken) {
      return micropub.errorResponse('forbidden', 'Unable to verify access token');
    }

    // Normalise form-encoded requests as mf2 JSON
    if (!request.is('json')) {
      body = micropub.convertFormEncodedToMf2(body);
    }

    // Determine action, ensuring token includes scope permission
    const {scope} = verifiedToken;
    const {action} = body;
    const {url} = body;

    // Delete action (WIP)
    if (action === 'delete') {
      if (scope.includes('delete')) {
        return micropub.deletePost(url);
      }

      return micropub.errorResponse('insufficient_scope');
    }

    // Update action (not yet supported)
    if (action === 'update') {
      if (scope.includes('update')) {
        return micropub.errorResponse('not_supported', 'Update action not supported');
      }

      return micropub.errorResponse('insufficient_scope');
    }

    // Create action
    if (scope.includes('create')) {
      return micropub.createPost(body, pubConfig);
    }

    return micropub.errorResponse('insufficient_scope');
  };

  try {
    const postResponse = await getPostResponse(request);
    return response.status(postResponse.code).set({
      location: postResponse.location
    }).json(postResponse.body);
  } catch (error) {
    console.error(error);
  }

  next();
};
