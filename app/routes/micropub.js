const config = require(process.env.PWD + '/app/config');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const publication = require(process.env.PWD + '/app/lib/publication');
const record = require(process.env.PWD + '/app/lib/record');
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
  const pub = await publication.resolveConfig(config['pub-config']);
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
  const pub = await publication.resolveConfig(config['pub-config']);
  const getResult = async request => {
    const {body} = request;
    const {files} = request;

    // Normalise form-encoded requests as mf2 JSON
    let mf2 = body;
    if (!request.is('json')) {
      mf2 = microformats.formEncodedToMf2(body);
    }

    // Verify access token
    const accessToken = request.headers.authorization || body.access_token;
    const authResponse = await indieauth.verifyToken(accessToken);
    const authError = authResponse.body && authResponse.body.error;

    // Return any errors from IndieAuth token endpoint
    if (authError) {
      return authResponse;
    }

    // Perform action, ensuring token provides enough scope
    const {scope} = authResponse;
    const hasScope = scope && scope.length > 0;
    const action = request.query.action || body.action;
    const url = request.query.url || body;

    if (action === 'delete') {
      if (hasScope && scope.includes('delete')) {
        return micropub.deletePost(url);
      }

      return utils.error('insufficient_scope');
    }

    if (action === 'undelete') {
      if (hasScope && scope.includes('create')) {
        const recordData = record.read(url);
        const {mf2} = recordData;
        return micropub.createPost(pub, mf2, files);
      }

      return utils.error('insufficient_scope');
    }

    if (action === 'update') {
      if (hasScope && scope.includes('update')) {
        return utils.error('invalid_request', 'Update action not supported');
      }

      return utils.error('insufficient_scope');
    }

    if (hasScope && scope.includes('create')) {
      return micropub.createPost(pub, mf2, files);
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
