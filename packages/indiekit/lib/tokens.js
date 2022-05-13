import HttpError from "http-errors";
import { fetch } from "undici";
import { getCanonicalUrl } from "./utils.js";

export const findBearerToken = (request) => {
  if (request.session?.token) {
    const bearerToken = request.session.token;
    return bearerToken;
  }

  if (request.headers?.authorization) {
    const bearerToken = request.headers.authorization.trim().split(/\s+/)[1];
    return bearerToken;
  }

  if (request.body?.access_token) {
    const bearerToken = request.body.access_token;
    delete request.body.access_token;
    return bearerToken;
  }

  if (request.query?.token) {
    const bearerToken = request.query.token;
    return bearerToken;
  }

  throw new HttpError.BadRequest("No bearer token provided by request");
};

/**
 * Request an access token
 *
 * @param {string} tokenEndpoint Token endpoint
 * @param {object} bearerToken OAuth bearer token
 * @returns {Promise|object} Access token
 */
export const requestAccessToken = async (tokenEndpoint, bearerToken) => {
  const endpointResponse = await fetch(tokenEndpoint, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${bearerToken}`,
    },
  });

  const body = await endpointResponse.json();

  if (!endpointResponse.ok) {
    throw new HttpError(
      endpointResponse.status,
      body.error_description || endpointResponse.statusText
    );
  }

  return body;
};

/**
 * @param {object} me Publication URL
 * @param {object} accessToken Access token
 * @returns {object} Verified token
 */
export const verifyAccessToken = (me, accessToken) => {
  // Throw error if no publication URL provided
  if (!me) {
    throw new HttpError(400, "No publication URL to verify");
  }

  // Throw error if access token does not contain a `me` value
  if (!accessToken.me) {
    throw new HttpError(401, "There was a problem with this access token");
  }

  // Normalize publication and token URLs before comparing
  const accessTokenMe = getCanonicalUrl(accessToken.me);
  const publicationMe = getCanonicalUrl(me);
  const isAuthenticated = accessTokenMe === publicationMe;

  // Publication URL does not match that provided by access token
  if (!isAuthenticated) {
    throw new HttpError(
      403,
      "Publication URL does not match that provided by access token"
    );
  }

  return accessToken;
};
