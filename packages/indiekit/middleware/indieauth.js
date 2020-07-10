import httpError from 'http-errors';
import {
  getBearerToken,
  requestAccessToken,
  verifyAccessToken
} from '../lib/tokens.js';

/**
 * Authenticate request using IndieAuth
 *
 * @param {object} publication Publication configuration
 * @returns {Function} Next middleware
 */
export const indieauth = publication => {
  const {me, tokenEndpoint} = publication;

  return async function (request, response, next) {
    try {
      publication.bearerToken = getBearerToken(request);
      const accessToken = await requestAccessToken(tokenEndpoint, publication.bearerToken);
      publication.accessToken = verifyAccessToken(me, accessToken);

      next();
    } catch (error) {
      next(httpError(400, error.message, {
        json: {
          error: 'invalid_request',
          error_description: error.message
        }
      }));
    }
  };
};
