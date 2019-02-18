const config = require(__basedir + '/.cache/config.json');
const indieauth = require(__basedir + '/app/functions/indieauth');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Respond to endpoint GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 *
 */
exports.get = function (request, response) {
  const appUrl = `${request.protocol}://${request.headers.host}`;
  const getResponse = micropub.queryResponse(request.query.q, appUrl);

  return response.status(getResponse.code).json(getResponse.body);
};

/**
 * Respond to endpoint POST requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 *
 */
exports.post = async function (request, response) {
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
      body = micropub.convertFormEncodedToMf2(body); // Does this break body.action?
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
        // return micropub.createPost(body);
        return micropub.errorResponse('not_supported', 'Create action not supported');
      }
    } catch {
      return micropub.errorResponse('insufficient_scope');
    }
  };

  const postResponse = await getPostResponse(request);
  return response.status(postResponse.code).json(postResponse.body);
};
