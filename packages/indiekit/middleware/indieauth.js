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
    // If already have a token, skip verification process
    // (multipart/form-data may not have `Authorisation` header)
    // TODO: Check token expiry and refresh token if needed
    if (response.locals.publication && response.locals.publication.token) {
      return next();
    }

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
