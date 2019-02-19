const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');

const appConfig = require(__basedir + '/app/config.js');

/**
 * Gets authorization response from IndieAuth token endpoint
 *
 * @param {String} accessToken Access token
 * @returns {Promise} Fetch request to IndieAuth token endpoint
 */
exports.getAuthResponse = function (accessToken) {
  const endpoint = appConfig.indieauth['token-endpoint'];
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
    console.error(`indieauth.getAuthResponse: ${error.message}`);
  });
};

/**
 * Verifies that token provides permission to post to configured destination
 *
 * @param {String} accessToken Access token
 * @param {String} url Destination URL
 * @returns {Object} Endpoint response
 */
exports.verifyToken = async function (accessToken, url) {
  const authResponse = await module.exports.getAuthResponse(accessToken);

  try {
    if (!authResponse) {
      throw new Error('No response from token endpoint');
    }

    if (authResponse.error) {
      // TODO: Check if all clients support authResponse.error
      throw new Error(authResponse.error_description);
    }

    const isAuthenticated = normalizeUrl(authResponse.me) === normalizeUrl(url);
    if (!isAuthenticated) {
      throw new Error(`${url} does not match that provided by token`);
    }

    return authResponse;
  } catch (error) {
    console.error(`indieauth.verifyToken: ${error.message}`);
  }
};
