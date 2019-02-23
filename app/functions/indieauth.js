/**
 * Use {@link https://www.w3.org/TR/indieauth/ IndieAuth} to ensure only
 * authenticated users can use endpoint to post to configured destination.
 *
 * @module functions/indieauth
 */

const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');

const appConfig = require(__basedir + '/app/config.js');

/**
 * Gets authorization response from IndieAuth token endpoint
 *
 * @param {String} accessToken Access token
 * @returns {Promise} Fetch request to IndieAuth token endpoint
 */
const getAuthResponse = async accessToken => {
  const endpoint = appConfig.indieauth['token-endpoint'];
  const isValidTokenFormat = accessToken.startsWith('Bearer ');

  if (!isValidTokenFormat) {
    accessToken = 'Bearer ' + accessToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: accessToken
      }
    });

    if (response) {
      return await response.json();
    }

    throw new Error(`Unable to connect to ${endpoint}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Verifies that token provides permission to post to configured destination
 *
 * @param {String} accessToken Access token
 * @param {String} url Destination URL
 * @returns {Object} Endpoint response
 */
const verifyToken = async (accessToken, url) => {
  try {
    const authResponse = await module.exports.getAuthResponse(accessToken);

    if (!authResponse) {
      throw new Error('No response from token endpoint');
    }

    /* @todo Check if all clients support authResponse.error */
    if (authResponse.error) {
      throw new Error(authResponse.error_description);
    }

    const isAuthenticated = normalizeUrl(authResponse.me) === normalizeUrl(url);
    if (!isAuthenticated) {
      throw new Error(`${url} does not match that provided by token`);
    }

    return authResponse;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAuthResponse,
  verifyToken
};
