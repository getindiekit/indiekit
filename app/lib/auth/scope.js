const {IndieKitError} = require(process.env.PWD + '/app/errors');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Checks if scope in authenticated token contains specified scope.
 * Automatically handles `post` and `create` as the same thing
 *
 * @memberof auth
 * @module scope.middleware
 * @param {String} requiredScope Scope to check
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 * @return {Object} Error
 */
const middleware = requiredScope => (req, res, next) => {
  try {
    const tokenScope = res.locals.indieauthToken.scope;
    module.exports.checkScope(requiredScope, tokenScope);
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
 * Checks if scope in authenticated token contains specified scope.
 * Automatically handles `post` and `create` as the same thing
 *
 * @memberof auth
 * @module scope.checkScope
 * @param {String} requiredScope Requested scope
 * @param {Object} tokenScope Scope(s) provided by access token
 * @return {Boolean} True if tokenScope includes requiredScope
 */
const checkScope = (requiredScope, tokenScope) => {
  logger.debug('auth.scope.checkScope, required scope: %s', requiredScope);
  logger.debug('auth.scope.checkScope, token scope: %s', tokenScope);

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

module.exports = {
  middleware,
  checkScope
};
