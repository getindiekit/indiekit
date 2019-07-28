const fetch = require('node-fetch');

const logger = require(process.env.PWD + '/app/logger');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Verifies that a token provides permissions to post to configured publication,
 * using {@link https://www.w3.org/TR/indieauth/ IndieAuth} to ensure only
 * authenticated users can use endpoint for posting to configured destination.
 *
 * @memberof auth
 * @module indieauth
 * @param {Object} options Middleware optionn
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @return {Function} Call next middleware function
 * @return {Object} Error response
 */
module.exports = options => async (req, res, next) => {
  let accessToken;
  if (req.headers.authorization) {
    accessToken = req.headers.authorization.trim().split(/\s+/)[1];
  } else if (!accessToken && req.body && req.body.access_token) {
    accessToken = req.body.access_token;
    delete req.body.access_token; // Delete token from body if exists
  }

  if (!accessToken) {
    const error_description = 'No access token provided in request';
    logger.error('auth.indieauth: %s', error_description);
    return res.status(401).json({
      error: 'unauthorized',
      error_description
    });
  }

  const {me} = options;
  if (!me) {
    const error_description = 'Publication URL not configured';
    logger.error('auth.indieauth: %s', error_description);
    return res.status(400).json({
      error: 'invalid_request',
      error_description
    });
  }

  let verifiedToken;
  try {
    const endpoint = options['token-endpoint'] || 'https://tokens.indieauth.com/token';
    verifiedToken = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    verifiedToken = await verifiedToken.json();
    if (verifiedToken.error) {
      const {error_description} = verifiedToken;
      logger.error('auth.indieauth: %', error_description);
      return res.status(401).json({
        error: 'unauthorized',
        error_description
      });
    }

    const isAuthenticated = utils.normalizeUrl(verifiedToken.me) === utils.normalizeUrl(me);
    if (!isAuthenticated) {
      const error_description = 'User does not have permission to perform request';
      logger.error('auth.indieauth: %s', error_description);
      return res.status(403).json({
        error: 'forbidden',
        error_description
      });
    }

    // Save verified indieauth token to locals
    res.locals.indieauthToken = verifiedToken;

    next();
  } catch (error) {
    const error_description = error.description || 'Error validating token';
    logger.error('auth.indieauth: %s', error_description);
    return res.status(400).json({
      error: 'invalid_request',
      error_description
    });
  }
};
