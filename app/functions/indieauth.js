const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');

const config = require(__basedir + '/app/config.js');

/**
 * Get authorization response from IndieAuth token endpoint
 *
 * @param {String} accessToken Access token
 * @returns {Object} JSON object
 *
 */
exports.getAuthResponse = function (accessToken) {
  const endpoint = config.indieauth['token-endpoint'];
  const isValidTokenFormat = accessToken.startsWith('Bearer ');

  if (!isValidTokenFormat) {
    accessToken = 'Bearer ' + accessToken;
  }

  return fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: accessToken
    }
  }).then(endpointResponse => {
    return endpointResponse.json();
  }).then(json => {
    return json;
  }).catch(error => {
    console.error(`${error.name}: ${error.message}`);
  });
};

/**
 * Verify token provides permission to post to configured destination
 *
 * @param {String} accessToken Access token
 * @param {String} url Destination URL
 * @returns {Boolean} Token validity
 *
 */
exports.verifyToken = async function (accessToken, url) {
  const authResponse = await module.exports.getAuthResponse(accessToken);

  try {
    if (!authResponse) {
      throw new Error('No response from token endpoint');
    }

    if (authResponse.error) { // TODO: Check if all clients support authResponse.error
      throw new Error(authResponse.error_description);
    }

    const authenticatedUrl = normalizeUrl(authResponse.me);
    const destinationUrl = normalizeUrl(url);
    const isAuthenticated = authenticatedUrl === destinationUrl;
    if (!isAuthenticated) {
      throw new Error(`${url} does not match that provided by token endpoint`);
    }

    return authResponse;
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
};
