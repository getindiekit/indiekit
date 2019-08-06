const fetch = require('node-fetch');

const {IndieKitError} = require(process.env.PWD + '/app/errors');
const logger = require(process.env.PWD + '/app/logger');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Middleware function for verifyToken
 *
 * @memberof auth
 * @module indieauth.middleware
 * @param {Object} options Middleware option
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 * @return {Object} Error
 */
const middleware = options => async (req, res, next) => {
  try {
    let accessToken;
    if (req.headers.authorization) {
      accessToken = req.headers.authorization.trim().split(/\s+/)[1];
    } else if (!accessToken && req.body && req.body.access_token) {
      accessToken = req.body.access_token;
      delete req.body.access_token; // Delete token from body if exists
    }

    // Save verified indieauth token to locals
    const verifiedToken = module.exports.verifyToken(accessToken, options);
    res.locals.indieauthToken = verifiedToken;
    next();
  } catch (error) {
    const {message} = error;
    return res.status(message.status).json({
      error: message.error,
      error_description: message.error_description
    });
  }
};

/**
 * Verifies that a token provides permissions to post to a publication,
 * using {@link https://www.w3.org/TR/indieauth/ IndieAuth}.
 *
 * @memberof auth
 * @module indieauth.verifyToken
 * @param {Object} accessToken IndieAuth access token
 * @param {Object} options Options
 * @return {Boolean} True if verifyToken autheticates publisher
 */
const verifyToken = async (accessToken, options) => {
  logger.debug('auth.indieauth.verifyToken, access token: %s', accessToken);
  logger.debug('auth.indieauth.verifyToken, options: %s', options);

  if (!accessToken) {
    throw new IndieKitError({
      status: 401,
      error: 'unauthorized',
      error_description: 'No access token provided in request'
    });
  }

  console.log('options.me', options.me);

  const {me} = options;
  if (!me) {
    throw new IndieKitError({
      status: 400,
      error: 'invalid_request',
      error_description: 'Publication URL not configured'
    });
  }

  let verifiedToken;
  let status;
  try {
    const endpoint = options['token-endpoint'] || 'https://tokens.indieauth.com/token';
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    verifiedToken = await response.json();
    status = response.status;
  } catch (error) {
    // Unknown error, but most likely unable to reach token endpoint
    throw new IndieKitError({
      status: 400,
      error: 'invalid_request',
      error_description: 'Error validating token'
    });
  }

  // Endpoint has responded, but with an error
  if (verifiedToken.error) {
    throw new IndieKitError({
      status,
      error: verifiedToken.error,
      error_description: verifiedToken.error_description
    });
  }

  // Endpoint has responded, but without a `me` value
  if (!verifiedToken.me) {
    throw new IndieKitError({
      status: 404,
      error: 'not_found',
      error_description: 'There was a problem with this access token'
    });
  }

  console.log('verifiedToken', verifiedToken);

  // Normalize publication and token URLs before comparing
  const verifiedTokenMe = utils.normalizeUrl(verifiedToken.me);
  const publicationMe = utils.normalizeUrl(me);
  const isAuthenticated = verifiedTokenMe === publicationMe;

  // Publication URL does not match that provided by access token
  if (!isAuthenticated) {
    console.log('IS NOT Authenticated');
    throw new IndieKitError({
      status: 403,
      error: 'forbidden',
      error_description: 'User does not have permission to perform request'
    });
  }

  return verifiedToken;
};

module.exports = {
  middleware,
  verifyToken
};
