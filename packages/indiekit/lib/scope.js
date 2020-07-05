import HttpError from 'http-errors';

/**
 * Check provided scope(s) satisfies required scope
 *
 * @param {object} providedScope Provided scope
 * @param {string} requiredScope Required scope
 * @returns {boolean} True if providedScope includes requiredScope
 */
export const checkScope = (providedScope, requiredScope) => {
  if (!providedScope) {
    providedScope = 'create';
  }

  if (!requiredScope) {
    requiredScope = 'create';
  }

  const scopes = providedScope.split(' ');
  let hasScope = scopes.includes(requiredScope);

  // Handle deprecated `post` scope
  if (requiredScope === 'post' && !hasScope) {
    hasScope = scopes.includes('create');
  }

  if (requiredScope === 'create' && !hasScope) {
    hasScope = scopes.includes('post');
  }

  if (hasScope) {
    return true;
  }

  throw new HttpError.Unauthorized(`Access token does not meet requirements for requested scope (${requiredScope})`);
};
