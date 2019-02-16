const normalizeUrl = require('normalize-url');

const config = require(__basedir + '/.cache/config.json');
const format = require(__basedir + '/app/functions/format');
const indieauth = require(__basedir + '/app/functions/indieauth');
const microformats = require(__basedir + '/app/functions/microformats');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Respond to errors
 *
 * @private
 * @param {Object} response HTTP response
 * @param {String} id Error identifier
 * @return {Object} Error response
 *
 */
function error(response, id) {
  const error = micropub.errorResponse(id);
  return response.status(error.code).json(error.json);
}

/**
 * Respond to errors
 *
 * @private
 * @param {Object} response HTTP response
 * @param {String} id Success identifier
 * @param {String} location Post URL
 * @return {Object} Success response
 *
 */
function success(response, id, location) {
  const success = micropub.successResponse(id, location);
  return response.status(success.code).set({
    location
  }).json(success.json);
}

/**
 * Respond to endpoint GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} JSON response
 *
 */
exports.get = function (request, response) {
  const appUrl = `${request.protocol}://${request.headers.host}`;
  const queryResponse = micropub.queryResponse(request.query.q, appUrl);

  return response.status(queryResponse.code).json(queryResponse.json);
};

/**
 * Respond to endpoint POST requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Callback
 *
 */
exports.post = async function (request, response) {
  const repoUrl = `https://github.com/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/blob/master/`;

  // Check if token is provided
  const token = request.headers.authorization || request.body.access_token;
  if (!token) {
    error(response, 'unauthorized');
    return;
  }

  // Verify token with IndieAuth endpoint
  const authResponse = await indieauth.getAuthorizationResponse(token);
  if (!authResponse) {
    return error(response, 'forbidden');
  }

  // Verify that token provides permission to post to configured destination
  const authenticatedUrl = normalizeUrl(authResponse.me);
  const destinationUrl = normalizeUrl(config.url);
  const isAuthenticated = authenticatedUrl === destinationUrl;
  if (!isAuthenticated) {
    return error(response, 'forbidden');
  }

  // Verify that token provides permission to create posts
  const isScoped = authResponse.scope.includes('create');
  if (!isScoped) {
    return error(response, 'insufficient_scope');
  }

  // Normalise form-encoded and JSON requests as mf2 JSON
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

  // Determine post type
  const postType = microformats.getType(mf2);

  // Format paths and templates
  const postConfig = config['post-types'][0][postType];
  const postFilePath = format.string(postConfig.path, postData);
  const postTemplate = format.template(`templates/${postType}.njk`, postData);

  // TODO: Push postTemplate to GitHub repo

  // If file successfully pushed to GitHub
  const location = repoUrl + postFilePath;
  return success(response, 'create', location);
};
