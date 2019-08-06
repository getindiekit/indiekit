const {IndieKitError} = require(process.env.PWD + '/app/errors');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Checks if scope(s) in authenticated token contains required scope.
 * Automatically handles `post` and `create` as the same thing
 *
 * @memberof indieauth
 * @module checkScope
 * @param {String} requiredScope Required scope
 * @param {Object} tokenScope Scope(s) provided by access token
 * @return {Boolean} True if tokenScope includes requiredScope
 */
module.exports = (requiredScope, tokenScope) => {
  logger.debug('auth.checkScope, required scope: %s', requiredScope);
  logger.debug('auth.checkScope, token scope: %s', tokenScope);

  if (!requiredScope) {
    throw new IndieKitError({
      status: 401,
      error: 'unauthorized',
      error_description: 'No scope was provided in request'
    });
  }

  if (!tokenScope) {
    throw new IndieKitError({
      status: 401,
      error: 'unauthorized',
      error_description: 'Access token does not provide any scope(s)'
    });
  }

  const scopes = tokenScope.split(' ');
  let hasScope = scopes.includes(requiredScope);

  // Create and post are equal
  if (requiredScope === 'post' && !hasScope) {
    hasScope = scopes.includes('create');
  }

  if (requiredScope === 'create' && !hasScope) {
    hasScope = scopes.includes('post');
  }

  if (hasScope) {
    return true;
  }

  throw new IndieKitError({
    status: 401,
    error: 'insufficient_scope',
    error_description: `Access token does not meet requirements for requested scope (${requiredScope})`
  });
};
