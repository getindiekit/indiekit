import { randomString } from "@indiekit/util";

/**
 * Mimic a Pushed Authorization Request (PAR)
 *
 * Ordinarily a PAR would make a request to endpoint. Instead, we will use a
 * request URI to look up data in locals.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc9126}
 * @see {@link https://www.jvt.me/posts/2020/12/09/personal-indieauth-server/#pushed-authorization-requests-par}
 */

/**
 * Create a PAR URI
 * @param {import("express").Request} request - Request
 * @returns {string} OAuth request URI
 */
export const createRequestUri = (request) => {
  const reference = randomString();
  request.app.locals[reference] = request.query;

  return "urn:ietf:params:oauth:request_uri:" + reference;
};

/**
 * Get data from PAR URI
 * @param {import("express").Request} request - Request
 * @returns {object} Saved payload
 */
export const getRequestUriData = (request) => {
  const { request_uri } = request.query;
  const reference = String(request_uri).split(":")[5];

  return request.app.locals[reference];
};
