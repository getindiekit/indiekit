import got from 'got';
import HttpError from 'http-errors';
import normalizeUrl from 'normalize-url';

export const getBearerToken = request => {
  if (request.headers && request.headers.authorization) {
    const bearerToken = request.headers.authorization.trim().split(/\s+/)[1];
    return bearerToken;
  }

  if (request.body && request.body.access_token) {
    const bearerToken = request.body.access_token;
    delete request.body.access_token;
    return bearerToken;
  }

  throw new HttpError.BadRequest('No bearer token provided by request');
};

/**
 * Request an access token
 *
 * @param {string} tokenEndpoint Token endpoint
 * @param {object} bearerToken oAuth bearer token
 * @returns {object} Access token
 */
export const requestAccessToken = async (tokenEndpoint, bearerToken) => {
  try {
    const {body} = await got(tokenEndpoint, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      },
      responseType: 'json'
    });

    const accessToken = body;
    return accessToken;
  } catch (error) {
    if (error.response) {
      throw new HttpError(error.response.statusCode, error.response.body.error_description);
    } else {
      throw new HttpError(500, error);
    }
  }
};

/**
 * @param {object} me Publication URL
 * @param {object} accessToken Access token
 * @returns {object} Verified token
 */
export const verifyAccessToken = (me, accessToken) => {
  // Throw error if no publication URL provided
  if (!me) {
    throw new HttpError(400, 'No publication URL to verify');
  }

  // Throw error if access token does not contain a `me` value
  if (!accessToken.me) {
    throw new HttpError(401, 'There was a problem with this access token');
  }

  // Normalize publication and token URLs before comparing
  const accessTokenMe = normalizeUrl(accessToken.me);
  const publicationMe = normalizeUrl(me);
  const isAuthenticated = accessTokenMe === publicationMe;

  // Publication URL does not match that provided by access token
  if (!isAuthenticated) {
    throw new HttpError(403, 'User does not have permission to perform request');
  }

  return accessToken;
};
