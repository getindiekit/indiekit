const config = require(__basedir + '/.cache/config.json');
const indieauth = require(__basedir + '/app/functions/indieauth');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Responds to GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 */
exports.get = function (request, response) {
  const appUrl = `${request.protocol}://${request.headers.host}`;
  const getResponse = micropub.queryResponse(request.query.q, appUrl);

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
exports.post = async function (request, response, next) {
  const getPostResponse = async function (request) {
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
    const verifiedToken = await indieauth.verifyToken(accessToken, config.url);
    if (!verifiedToken) {
      return micropub.errorResponse('forbidden', 'Unable to verify access token');
    }

    // Normalise form-encoded requests as mf2 JSON
    if (!request.is('json')) {
      body = micropub.convertFormEncodedToMf2(body);
    }

    // Determine action, ensuring token includes scope permission
    const {scope} = verifiedToken;
    try {
      if (body.action === 'delete' && scope.includes('delete')) {
        return micropub.errorResponse('not_supported', 'Delete action not supported');
      }

      if (body.action === 'update' && scope.includes('update')) {
        return micropub.errorResponse('not_supported', 'Update action not supported');
      }

      if (scope.includes('create')) {
        const location = await micropub.createPost(body);

        try {
          return micropub.successResponse('create', location);
        } catch {
          return micropub.errorResponse('server_error', 'Create action failed');
        }
      }

      return micropub.errorResponse('insufficient_scope');
    } catch {
      return micropub.errorResponse('server_error', 'Micropub action failed');
    }
  };

  const postResponse = await getPostResponse(request);
  try {
    return response.status(postResponse.code).set({
      location: postResponse.location
    }).json(postResponse.body);
  } catch (error) {
    console.error('postResponse', error);
  }

  next();
};
