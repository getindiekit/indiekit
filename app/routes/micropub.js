const normalizeUrl = require('normalize-url');

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
 * @param {Object} next Callback
 *
 */
exports.post = function (request, response) {
  const getPostResponse = async function (request) {
    // Check response has body data
    const hasBody = Object.entries(request.body).length !== 0;
    if (!hasBody) {
      throw micropub.errorResponse('invalid_request');
    }

    // Check if token is provided
    const token = request.headers.authorization || request.body.access_token;
    if (!token) {
      throw micropub.errorResponse('unauthorized');
    }

    // Verify token with IndieAuth endpoint
    const authResponse = await indieauth.getAuthorizationResponse(token);
    if (!authResponse) {
      throw micropub.errorResponse('forbidden');
    }

    // Check if token provides permission to post to configured destination
    const authenticatedUrl = normalizeUrl(authResponse.me);
    const destinationUrl = normalizeUrl(config.url);
    const isAuthenticated = authenticatedUrl === destinationUrl;
    if (!isAuthenticated) {
      throw micropub.errorResponse('forbidden');
    }

    // Check if token provides permission to create posts
    // TODO: Check for all requested scopes (create, update, delete)
    const isScoped = authResponse.scope.includes('create');
    if (!isScoped) {
      throw micropub.errorResponse('insufficient_scope');
    }

    // Normalise form-encoded and JSON requests as mf2 JSON
    let mf2;
    if (request.is('json')) {
      mf2 = request.body;
    } else {
      mf2 = micropub.convertFormEncodedToMf2(request.body);
    }

    // Determine action
    switch (request.body.action) {
      case ('delete'):
        throw micropub.errorResponse('not_supported');
      case ('update'):
        throw micropub.errorResponse('not_supported');
      default:
        return micropub.createPost(mf2);
    }
  };

  getPostResponse(request).then(postResponse => {
    return response.status(postResponse.code).json(postResponse.body);
  }).catch(error => {
    return response.status(error.code).json(error.body);
  });
};
