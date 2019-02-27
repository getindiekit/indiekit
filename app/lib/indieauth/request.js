const fetch = require('node-fetch');

const config = require(__basedir + '/config');

/**
 * Authenticates an access token with IndieAuth token endpoint
 *
 * @memberof indieauth
 * @module request
 * @param {String} accessToken Access token
 * @returns {Promise} Token endpoint reponse object
 */
module.exports = async accessToken => {
  const endpoint = config.indieauth['token-endpoint'];
  const isValidTokenFormat = accessToken.startsWith('Bearer ');

  if (!isValidTokenFormat) {
    accessToken = 'Bearer ' + accessToken;
  }

  try {
    console.info(`Making request to ${endpoint}`);
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
