const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const utils = require(process.env.PWD + '/app/lib/utils');

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
  const result = await micropub.query(request, pub);

  return response.status(result.code).json(result.body);
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
exports.post = async (request, response) => {
  const pub = await require(process.env.PWD + '/app/lib/publication')();
  const getResult = async request => {
    let {body} = request;
    const {files} = request;

    // Ensure response has body data
    const hasBody = Object.entries(body).length !== 0;
    if (!hasBody) {
      return utils.error('invalid_request');
    }

    // Normalise form-encoded requests as mf2 JSON
    if (!request.is('json')) {
      body = microformats.formEncodedToMf2(body);
    }

    // Ensure token is verified and provides scope
    const accessToken = request.headers.authorization || body.access_token;
    const authResponse = await indieauth.verifyToken(accessToken);
    const {scope} = authResponse;
    if (!scope) {
      return authResponse;
    }

    // Determine Micropub action
    const {action} = body;
    if (scope.includes('delete') && action === 'delete') {
      return micropub.deletePost(body.url);
    }

    if (scope.includes('update') && action === 'update') {
      return utils.error('invalid_request', 'Update action not supported');
    }

    if (scope.includes('create')) {
      return micropub.createPost(pub, body, files);
    }

    return utils.error('insufficient_scope');
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
