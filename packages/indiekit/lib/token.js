import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl } from "@indiekit/util";

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
 * Introspect token values
 * @param {string} introspectionEndpoint - Introspection endpoint
 * @param {object} bearerToken - OAuth bearer token
 * @returns {Promise<object>} Token values to verify
 */
export const introspectToken = async (introspectionEndpoint, bearerToken) => {
  const introspectionUrl = new URL(introspectionEndpoint);
  introspectionUrl.searchParams.append("token", bearerToken);

  const introspectionResponse = await fetch(introspectionUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!introspectionResponse.ok) {
    throw await IndiekitError.fromFetch(introspectionResponse);
  }

  return introspectionResponse.json();
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
