import got from 'got';
import HttpError from 'http-errors';
import normalizeUrl from 'normalize-url';

export const getBearerToken = (publication, request) => {
  if (request.headers && request.headers.authorization) {
    const bearerToken = request.headers.authorization.trim().split(/\s+/)[1];
    publication.bearerToken = bearerToken;
    return bearerToken;
  }

  if (request.body && request.body.access_token) {
    const bearerToken = request.body.access_token;
    delete request.body.access_token; // Delete token from body if exists
    publication.bearerToken = bearerToken;
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
  if (!bearerToken) {
    throw new HttpError.Unauthorized('No bearer token provided in request');
  }

  try {
    const endpointResponse = await got(tokenEndpoint, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      },
      responseType: 'json'
    });

    const accessToken = endpointResponse.body;
    return accessToken;
  } catch (error) {
    if (error.response) {
      const {response} = error;
      throw new HttpError(response.statusCode, response.body.error_description, {
        value: response.body.error
      });
    } else {
      throw new Error(error.message);
    }
  }
};

/**
 * @param {object} me Publication URL
 * @param {object} accessToken Access token
 * @returns {object} Verified token
 */
export const verifyAccessToken = (me, accessToken) => {
  try {
    // Throw error if no publication URL provided
    if (!me) {
      throw new HttpError(400, 'No publication URL to verify', {
        value: 'invalid_request'
      });
    }

    // Throw error if access token does not contain a `me` value
    if (!accessToken.me) {
      throw new HttpError(401, 'There was a problem with this access token', {
        value: 'unauthorized'
      });
    }

    // Normalize publication and token URLs before comparing
    const accessTokenMe = normalizeUrl(accessToken.me);
    const publicationMe = normalizeUrl(me);
    const isAuthenticated = accessTokenMe === publicationMe;

    // Publication URL does not match that provided by access token
    if (!isAuthenticated) {
      throw new HttpError(403, 'User does not have permission to perform request', {
        value: 'forbidden'
      });
    }

    return accessToken;
  } catch (error) {
    throw new HttpError(error.status, error.message);
  }
};
