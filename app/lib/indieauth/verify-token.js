const normalizeUrl = require('normalize-url');

const request = require(__basedir + '/lib/indieauth/request');

/**
 * Verifies that a token provides permissions to post to configured publication
 *
 * @memberof indieauth
 * @module verifyToken
 * @param {String} accessToken Access token
 * @param {String} url Publication URL
 * @returns {Promise} Token endpoint reponse object
 */
module.exports = async (accessToken, url) => {
  try {
    const authResponse = await request(accessToken);

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
