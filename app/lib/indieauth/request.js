const fetch = require('node-fetch');

const config = require(process.env.PWD + '/app/config');

/**
 * Authenticates an access token with IndieAuth token endpoint
 *
 * @memberof indieauth
 * @module request
 * @param {String} accessToken Access token
 * @param {String} endpoint IndieAuth token endpoint URL
 * @returns {Promise} Token endpoint reponse object
 */
module.exports = async (accessToken, endpoint = config.indieauth['token-endpoint']) => {
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

    return await response.json();
  } catch (error) {
    throw new Error(`Unable to connect to ${endpoint}`);
  }
};
