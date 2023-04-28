import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import { getCanonicalUrl } from "./utils.js";

export const findBearerToken = (request) => {
  if (request.session?.access_token) {
    const bearerToken = request.session.access_token;
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
 * Request token values
 * @param {string} tokenEndpoint - Token endpoint
 * @param {object} bearerToken - OAuth bearer token
 * @returns {Promise|object} Token values to verify
 */
export const requestTokenValues = async (tokenEndpoint, bearerToken) => {
  const tokenResponse = await fetch(tokenEndpoint, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!tokenResponse.ok) {
    throw await IndiekitError.fromFetch(tokenResponse);
  }

  return tokenResponse.json();
};

/**
 * @param {object} me - Publication URL
 * @param {object} tokenValues - Token values to verify
 * @returns {object} Verified token values
 */
export const verifyTokenValues = (me, tokenValues) => {
  // Normalize publication and token URLs before comparing
  const tokenValuesMe = getCanonicalUrl(tokenValues.me);
  const publicationMe = getCanonicalUrl(me);
  const isAuthenticated = tokenValuesMe === publicationMe;

  if (!isAuthenticated) {
    return false;
  }

  return tokenValues;
};
