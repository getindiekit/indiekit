import { IndiekitError } from "@indiekit/error";
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

  throw IndiekitError.invalidRequest("No bearer token provided by request");
};

/**
 * Request an access token
 *
 * @param {string} tokenEndpoint - Token endpoint
 * @param {object} bearerToken - OAuth bearer token
 * @returns {Promise|object} Access token
 */
export const requestAccessToken = async (tokenEndpoint, bearerToken) => {
  const endpointResponse = await fetch(tokenEndpoint, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!endpointResponse.ok) {
    throw await IndiekitError.fromFetch(endpointResponse);
  }

  return endpointResponse.json();
};

/**
 * @param {object} me - Publication URL
 * @param {object} accessToken - Access token
 * @returns {object} Verified token
 */
export const verifyAccessToken = (me, accessToken) => {
  // Normalize publication and token URLs before comparing
  const accessTokenMe = getCanonicalUrl(accessToken.me);
  const publicationMe = getCanonicalUrl(me);
  const isAuthenticated = accessTokenMe === publicationMe;

  if (!isAuthenticated) {
    return false;
  }

  return accessToken;
};
