const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Responds to Micropub media-endpoint POST requests
 *
 * @memberof routes
 * @module media.post
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Callback
 * @return {Object} HTTP response
 */
exports.post = async (request, response) => {
  const pub = await require(process.env.PWD + '/app/lib/publication')();
  const getResult = async request => {
    const {body} = request;
    const {files} = request;

    // Ensure response includes files data
    const hasFiles = Object.entries(files).length !== 0;
    if (!hasFiles) {
      console.log('has no files');
      return utils.error('invalid_request');
    }

    // Create media, ensuring token is verified and provides scope
    const accessToken = request.headers.authorization || body.access_token;
    const authResponse = await indieauth.verifyToken(accessToken);
    const {scope} = authResponse;
    if (!scope) {
      return authResponse;
    }

    if (scope.includes('create') || scope.includes('media')) {
      return micropub.createMedia(pub, files);
    }

    return utils.error('insufficient_scope');
  };

  try {
    const result = await getResult(request);
    console.log('result.code', result.code);
    return response.status(result.code).set({
      location: result.location || null
    }).json(result.body);
  } catch (error) {
    console.error(error);
  }
};
