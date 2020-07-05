import HttpError from 'http-errors';

/**
 * Check provided scope(s) satisfies required scope
 *
 * @param {object} providedScope Provided scope
 * @returns {boolean} True if provided scope includes `create` or `media`
 */
export const checkScope = providedScope => {
  if (!providedScope) {
    providedScope = 'media';
  }

  const hasScope =
    providedScope.includes('create') ||
    providedScope.includes('media');

  if (hasScope) {
    return true;
  }

  throw new HttpError.Unauthorized('Access token does not meet requirements for requested scope (create or media)');
};
