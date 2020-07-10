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
  return async function (request, response, next) {
    try {
      const bearerToken = getBearerToken(publication, request);
      const accessToken = await requestAccessToken(publication.tokenEndpoint, bearerToken);
      const verifiedToken = await verifyAccessToken(publication.me, accessToken);
      response.locals.publication.token = verifiedToken;

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
