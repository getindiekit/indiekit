const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');

const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Verifies that a token provides permissions to post to configured publication,
 * using {@link https://www.w3.org/TR/indieauth/ IndieAuth} to ensure only
 * authenticated users can use endpoint for posting to configured destination.
 *
 * @memberof indieauth
 * @module verifyToken
 * @param {String} accessToken Access token
 * @param {String} [options] Publication URL and IndieAuth token endpoint URL
 * @returns {Promise} Token endpoint reponse object
 */
module.exports.verifyToken = async (accessToken, options) => {
  options = options || {};
  const pubUrl = options.pubUrl || config.url;
  const endpoint = options.endpoint || config.indieauth['token-endpoint'];

  if (!accessToken) {
    return utils.error('unauthorized');
  }

  if (!pubUrl) {
    return utils.error('invalid_request', 'Publication URL not configured');
  }

  let verifiedToken;
  try {
    verifiedToken = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken.replace(/^Bearer\s*/, '')}`
      }
    });
    verifiedToken = await verifiedToken.json();

    if (verifiedToken.error) {
      return utils.error(verifiedToken.error, verifiedToken.error_description);
    }

    const isAuthenticated = normalizeUrl(verifiedToken.me) === normalizeUrl(pubUrl);
    if (!isAuthenticated) {
      return utils.error('forbidden');
    }

    return verifiedToken;
  } catch (error) {
    throw new Error(`Unable to connect to ${endpoint}`);
  }
};
