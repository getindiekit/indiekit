import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl } from "@indiekit/util";

/**
 * Find bearer token in request
 * @param {Partial<Pick<Request, "body"|"headers"|"query"|"session">>} request - Express request
 * @returns {string} Bearer token
 * @throws {IndiekitError} No bearer token provided by request
 */
export const findBearerToken = (request) => {
  if (request.session?.access_token) {
    const bearerToken = request.session.access_token;
    return bearerToken;
  }

  if (request.headers?.authorization) {
    const bearerToken = request.headers.authorization.trim().split(/\s+/, 2)[1];
    return bearerToken;
  }

  if (request.body?.access_token) {
    const bearerToken = request.body.access_token;
    delete request.body.access_token;
    return bearerToken;
  }

  if (request.query?.token) {
    const bearerToken = String(request.query.token);
    return bearerToken;
  }

  throw IndiekitError.invalidRequest("No bearer token provided by request");
};

/**
 * Introspect token values
 * @param {string} introspectionEndpoint - Introspection endpoint
 * @param {string} bearerToken - OAuth bearer token
 * @returns {Promise<IndieAuthTokenVerificationResponse>} Token values to verify
 */
export const introspectToken = async (introspectionEndpoint, bearerToken) => {
  // Send the token in the request body, never the URL, where it would be
  // logged by servers and proxies along the way
  // @see {@link https://www.rfc-editor.org/rfc/rfc7662#section-2.1}
  const introspectionResponse = await fetch(introspectionEndpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ token: bearerToken }),
  });

  if (!introspectionResponse.ok) {
    throw await IndiekitError.fromFetch(introspectionResponse);
  }

  return introspectionResponse.json();
};

/**
 * Verify token values are for the publication
 * @param {string} me - Publication URL
 * @param {IndieAuthTokenVerificationResponse} tokenValues - Token values to verify
 * @returns {IndieAuthTokenVerificationResponse|false} Verified token values
 */
export const verifyTokenValues = (me, tokenValues) => {
  // Normalize publication and token URLs before comparing
  const tokenValuesMe = getCanonicalUrl(String(tokenValues.me));
  const publicationMe = getCanonicalUrl(me);
  const isAuthenticated = tokenValuesMe === publicationMe;

  if (!isAuthenticated) {
    return false;
  }

  return tokenValues;
};

/**
 * @import { Request } from "express"
 */
