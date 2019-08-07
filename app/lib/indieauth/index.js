/**
 * Middleware function for checkScope
 *
 * @memberof indieauth
 * @module scope
 * @param {String} requiredScope Scope to check
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 * @return {Object} Error
 */
const checkScope = requiredScope => (req, res, next) => {
  const tokenScope = res.locals.indieauthToken.scope;

  try {
    const checkScope = require('./check-scope');
    checkScope(requiredScope, tokenScope);
    return next();
  } catch (error) {
    const {message} = error;
    return res.status(message.status).json({
      error: message.error,
      error_description: message.error_description,
      scope: requiredScope
    });
  }
};

/**
 * Middleware function for verifyToken
 *
 * @memberof indieauth
 * @module token
 * @param {Object} options Middleware option
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 * @return {Object} Error
 */
const verifyToken = options => async (req, res, next) => {
  let accessToken;
  if (req.headers && req.headers.authorization) {
    accessToken = req.headers.authorization.trim().split(/\s+/)[1];
  } else if (!accessToken && req.body && req.body.access_token) {
    accessToken = req.body.access_token;
    delete req.body.access_token; // Delete token from body if exists
  }

  try {
    const verifyToken = require('./verify-token');
    const verifiedToken = await verifyToken(accessToken, options);

    // Save verified indieauth token to locals
    res.locals.indieauthToken = verifiedToken;
    return next();
  } catch (error) {
    const {message} = error;
    return res.status(message.status).json({
      error: message.error,
      error_description: message.error_description
    });
  }
};

module.exports = {
  checkScope,
  verifyToken
};
