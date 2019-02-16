const normalizeUrl = require('normalize-url');

const config = require(__basedir + '/.cache/config.json');
const format = require(__basedir + '/app/functions/format');
const indieauth = require(__basedir + '/app/functions/indieauth');
const microformats = require(__basedir + '/app/functions/microformats');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Respond to endpoint GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} JSON response
 *
 */
exports.get = function (request, response) {
  const {q} = request.query;
  const mediaEndpoint = config['media-endpoint'] || `https://${request.headers.host}/media`;
  const syndicateTo = config['syndicate-to'] || [];

  switch (q) {
    case ('config'):
      return response.json({
        'media-endpoint': mediaEndpoint,
        'syndicate-to': syndicateTo
      });
    case ('source'):
      return micropub.errorResponse(response, 'not_supported');
    case ('syndicate-to'):
      return response.json({
        'syndicate-to': syndicateTo
      });
    default:
      return micropub.errorResponse(response);
  }
};

/**
 * Respond to endpoint POST requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Next callback
 *
 */
exports.post = async function (request, response, next) {
  const destinationUrl = normalizeUrl(config.url);

  // Authenticate with IndieAuth enpoint
  const token = request.headers.authorization;
  const authResponse = await indieauth.getAuthorizationResponse(token);
  const authenticatedUrl = normalizeUrl(authResponse.me);
  const isAuthenticated = authenticatedUrl === destinationUrl;
  const isScoped = authResponse.scope.includes('create');

  if (isAuthenticated && isScoped) {
    let mf2;
    const {body} = request;

    if (body) {
      if (request.is('json')) {
        mf2 = body;
      } else {
        mf2 = micropub.convertFormEncodedToMf2(body);
      }
    }

    // Update mf2 JSON with date and slug values
    const slugSeparator = config['slug-separator'] || '-';
    const postData = mf2.properties;
    const postDate = micropub.getDate(mf2);
    const postSlug = micropub.getSlug(mf2, slugSeparator);
    postData.published = postDate;
    postData.slug = postSlug;

    // Post type discovery
    const postType = microformats.getType(mf2);
    console.log('postType', postType);

    // Format paths and templates
    const postConfig = config['post-types'][0][postType];
    const postFilePath = format.string(postConfig.path, postData);
    const postLocation = format.string(postConfig.url, postData);
    const postTemplate = format.template(`templates/${postType}.njk`, postData);

    console.log('postFilePath', postFilePath);
    console.log('postLocation', postLocation);
    console.log('postTemplate', postTemplate);
  }

  next();
};
