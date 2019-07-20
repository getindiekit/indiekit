const config = require(process.env.PWD + '/app/config');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const logger = require(process.env.PWD + '/app/logger');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const publication = require(process.env.PWD + '/app/lib/publication');
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
  logger.info('%s %s', request.method, request.originalUrl);

  const pub = await publication.resolveConfig(config['pub-config']);
  const getResult = async request => {
    const {files} = request;
    logger.info('Request file(s)', files);

    // Ensure request includes files data
    const hasFiles = files && files.length > 0;
    if (!hasFiles) {
      return utils.error('invalid_request');
    }

    // Verify access token
    const accessToken = request.headers.authorization;
    const authResponse = await indieauth.verifyToken(accessToken);
    const authError = authResponse.body && authResponse.body.error;

    // Return any errors from IndieAuth token endpoint
    if (authError) {
      return authResponse;
    }

    // Perform action, ensuring token provides enough scope
    const {scope} = authResponse;
    const hasScope = scope && scope.length > 0;

    if (hasScope && (scope.includes('create') || scope.includes('media'))) {
      return micropub.createMedia(pub, files);
    }

    return utils.error('insufficient_scope');
  };

  try {
    const result = await getResult(request);
    return response.status(result.code).set({
      location: result.location || null
    }).json(result.body);
  } catch (error) {
    logger.error(error);
  }
};
