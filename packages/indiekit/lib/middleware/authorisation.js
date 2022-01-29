import httpError from 'http-errors';
import {
  getBearerToken,
  requestAccessToken,
  verifyAccessToken,
} from '../tokens.js';

/**
 * Check if a user is authorized
 *
 * @param {object} publication Publication configuration
 * @returns {Function} Next middleware
 */
export const authorise = publication => {
  const {me, tokenEndpoint} = publication;

  return async function (request, response, next) {
    if (publication.accessToken) {
      return next();
    }

    try {
      const bearerToken = getBearerToken(request);
      const accessToken = await requestAccessToken(tokenEndpoint, bearerToken);
      publication.accessToken = verifyAccessToken(me, accessToken);

      next();
    } catch (error) {
      if (request.method === 'GET') {
        return response.redirect(`/session/login?redirect=${request.originalUrl}`);
      }

      next(httpError(400, error));
    }
  };
};
