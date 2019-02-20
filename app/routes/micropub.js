/**
 * @module routes/micropub
 */
const appConfig = require(__basedir + '/app/config');
const cache = require(__basedir + '/app/functions/cache');
const indieauth = require(__basedir + '/app/functions/indieauth');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Responds to GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 */
exports.get = async function (request, response) {
  let pubConfig = await cache.fetchFile(appConfig.config.path, appConfig.config.file);
  pubConfig = JSON.parse(pubConfig);

  const appUrl = `${request.protocol}://${request.headers.host}`;
  const getResponse = micropub.queryResponse(request.query.q, pubConfig, appUrl);

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
  let pubConfig = await cache.fetchFile(appConfig.config.path, appConfig.config.file);
  pubConfig = JSON.parse(pubConfig);

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

    if (body.action === 'delete') {
      if (scope.includes('delete')) {
        return micropub.deletePost(body.url);
      }

      return micropub.errorResponse('insufficient_scope');
    }

    if (body.action === 'update') {
      if (scope.includes('update')) {
        return micropub.errorResponse('not_supported', 'Update action not supported');
      }

      return micropub.errorResponse('insufficient_scope');
    }

    if (scope.includes('create')) {
      return micropub.createPost(body, pubConfig);
    }

    return micropub.errorResponse('insufficient_scope');
  };

  const postResponse = await getPostResponse(request);
  try {
    return response.status(postResponse.code).set({
      location: postResponse.location
    }).json(postResponse.body);
  } catch (error) {
    console.error(error);
  }

  next();
};
