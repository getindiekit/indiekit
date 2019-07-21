const config = require(process.env.PWD + '/app/config');

/**
 * Checks if scope in authenticated token contains specified scope.
 * Automatically handles `post` and `create` as the same thing
 *
 * @memberof micropub
 * @module hasScope
 * @param {String} requiredScope Scope to check
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @return {Function} Call next middleware function
 * @return {Object} Error response
 */
module.exports = requiredScope => (request, response, next) => {
  const {scope} = config.indieauth.token;
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
  return response.status(401).json({
    error: 'insufficient_scope',
    error_description: `Scope of access token does not meet requirements for requested scope (${requiredScope})`,
    scope: requiredScope
  });
};
