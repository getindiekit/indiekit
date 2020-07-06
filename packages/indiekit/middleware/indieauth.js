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
      const bearerToken = getBearerToken(request);
      const accessToken = await requestAccessToken(publication.tokenEndpoint, bearerToken);
      const verifiedToken = await verifyAccessToken(publication.me, accessToken);
      response.locals.publication.token = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};
