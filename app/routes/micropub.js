/**
 * @module routes/micropub
 */
const publication = require(__basedir + '/lib/publication');
const indieauth = require(__basedir + '/lib/indieauth');
const microformats = require(__basedir + '/lib/microformats');
const micropub = require(__basedir + '/lib/micropub');

/**
 * Responds to GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 */
exports.get = async (request, response) => {
  const pubConfig = await publication();
  const appUrl = `${request.protocol}://${request.headers.host}`;
  const getResponse = await micropub.query(request.query, pubConfig, appUrl);

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
  const pubConfig = await publication();
  const getPostResponse = async request => {
    let {body} = request;
    const {files} = request;

    // Ensure response has body data
    const hasBody = Object.entries(body).length !== 0;
    if (!hasBody) {
      return micropub.response.error('invalid_request');
    }

    // Ensure token is provided
    const accessToken = request.headers.authorization || body.access_token;
    if (!accessToken) {
      return micropub.response.error('unauthorized');
    }

    // Verify token
    const verifiedToken = await indieauth.verifyToken(accessToken, pubConfig.url);
    if (!verifiedToken) {
      return micropub.response.error('forbidden', 'Unable to verify access token');
    }

    // Normalise form-encoded requests as mf2 JSON
    if (!request.is('json')) {
      body = microformats.formEncodedToMf2(body);
    }

    // Determine action, ensuring token includes scope permission
    const {scope} = verifiedToken;
    const {action} = body;
    const {url} = body;

    // Delete action (WIP)
    if (action === 'delete') {
      if (scope.includes('delete')) {
        return micropub.delete(url);
      }

      return micropub.response.error('insufficient_scope');
    }

    // Update action (not yet supported)
    if (action === 'update') {
      if (scope.includes('update')) {
        return micropub.response.error('not_supported', 'Update action not supported');
      }

      return micropub.response.error('insufficient_scope');
    }

    // Create action
    if (scope.includes('create')) {
      return micropub.create(pubConfig, body, files);
    }

    return micropub.response.error('insufficient_scope');
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
