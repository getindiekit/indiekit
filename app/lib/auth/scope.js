const logger = require(process.env.PWD + '/app/logger');

/**
 * Checks if scope in authenticated token contains specified scope.
 * Automatically handles `post` and `create` as the same thing
 *
 * @memberof auth
 * @module scope
 * @param {String} requiredScope Scope to check
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @return {Object} Error response
 */
module.exports = requiredScope => (req, res, next) => {
  logger.info('auth.scope: %s', requiredScope);

  // Get indieauth token scope from locals
  const {scope} = res.locals.indieauthToken;
  if (scope) {
    const scopes = scope.split(' ');
    let hasScope = scopes.includes(requiredScope);

    // Create and post are equal
    if (requiredScope === 'post' && !hasScope) {
      hasScope = scopes.includes('create');
    }

    if (requiredScope === 'create' && !hasScope) {
      hasScope = scopes.includes('post');
    }

    // Has scope, continue
    if (hasScope) {
      return next();
    }
  }

  // No scope, send error response
  logger.error('auth.scope: insufficient_scope');
  return res.status(401).json({
    error: 'insufficient_scope',
    error_description: `Scope of access token does not meet requirements for requested scope (${requiredScope})`,
    scope: requiredScope
  });
};
