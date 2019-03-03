const config = require(process.env.PWD + '/app/config');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const micropub = require(process.env.PWD + '/app/lib/micropub');

/**
 * Responds to Micropub GET requests
 *
 * @memberof routes
 * @module micropub.get
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} HTTP response
 */
exports.get = async (request, response) => {
  const pub = await require(process.env.PWD + '/app/lib/publication')();
  const getResponse = await micropub.query(request, pub);

  return response.status(getResponse.code).json(getResponse.body);
};

/**
 * Responds to Micropub POST requests
 *
 * @memberof routes
 * @module micropub.post
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Callback
 * @return {Object} HTTP response
 */
exports.post = async (request, response, next) => {
  const pub = await require(process.env.PWD + '/app/lib/publication')();
  const getPostResponse = async request => {
    let {body} = request;
    const {files} = request;

    // Ensure response has body data
    const hasBody = Object.entries(body).length !== 0;
    if (!hasBody) {
      return micropub.error('invalid_request');
    }

    // Verify access token
    const accessToken = request.headers.authorization || body.access_token;
    const verifiedToken = await indieauth.verifyToken(accessToken, config.url);
    if (!verifiedToken) {
      return micropub.error('forbidden', 'Unable to verify access token');
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
    if (action === 'delete' && scope.includes('delete')) {
      return micropub.deletePost(url);
    }

    // Update action (not yet supported)
    if (action === 'update' && scope.includes('update')) {
      return micropub.error('invalid_request', 'Update action not supported');
    }

    // Create action
    if (scope.includes('create')) {
      return micropub.createPost(pub, body, files);
    }

    return micropub.error('insufficient_scope');
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
