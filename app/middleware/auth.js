const indieauth = require(process.env.PWD + '/lib/indieauth');

/**
 * Middleware function for checkScope.
 *
 * @param {String} requiredScope Scope to check
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 */
const checkScope = requiredScope => (req, res, next) => {
  const tokenScope = res.locals.indieauthToken.scope;

  try {
    indieauth.checkScope(requiredScope, tokenScope);
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware function for verifyToken
 *
 * @param {Object} options Middleware option
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 */
const verifyToken = options => async (req, res, next) => {
  let accessToken;
  if (req.headers && req.headers.authorization) {
    accessToken = req.headers.authorization.trim().split(/\s+/)[1];
  } else if (!accessToken && req.body && req.body.access_token) {
    accessToken = req.body.access_token;
    delete req.body.access_token; // Delete token from body if exists
  }

  const verifiedToken = await indieauth.verifyToken(accessToken, options).catch(error => {
    return next(error);
  });

  // Save verified indieauth token to locals
  res.locals.indieauthToken = verifiedToken;
  return next();
};

module.exports = {
  checkScope,
  verifyToken
};
