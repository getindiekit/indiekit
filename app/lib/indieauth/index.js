const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');

const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Verifies that a token provides permissions to post to configured publication,
 * using {@link https://www.w3.org/TR/indieauth/ IndieAuth} to ensure only
 * authenticated users can use endpoint for posting to configured destination.
 *
 * @memberof indieauth
 * @module indieauth
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @return {Function} Call next middleware function
 * @return {Object} Error response
 */
module.exports = async (request, response, next) => {
  const accessToken = request.headers.authorization || request.body.access_token;
  const endpoint = config.indieauth['token-endpoint'];
  const pubUrl = config.url;

  if (!accessToken) {
    return response.status(401).json({
      error: 'unauthorized',
      error_description: 'No access token provided in request'
    });
  }

  if (!pubUrl) {
    return response.status(400).json({
      error: 'invalid_request',
      error_description: 'Publication URL not configured'
    });
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
      return response.status(401).json({
        error: 'unauthorized',
        error_description: verifiedToken.error_description
      });
    }

    const isAuthenticated = normalizeUrl(verifiedToken.me) === normalizeUrl(pubUrl);
    if (!isAuthenticated) {
      return response.status(403).json({
        error: 'forbidden',
        error_description: 'User does not have permission to perform request'
      });
    }

    // Save verifiedToken to config
    config.indieauth.token = verifiedToken;

    next();
  } catch (error) {
    logger.error('indieauth', {error});
    return response.status(401).json({
      error: 'invalid_request',
      error_description: error.description || 'Error validating token'
    });
  }
};
