import { randomBytes } from "node:crypto";

/**
 * Canonicalise URL according to IndieAuth spec
 * @param {string} url - The URL to canonicalise
 * @returns {string} The canonicalised URL
 * @see {@link https://indieauth.spec.indieweb.org/#url-canonicalization}
 */
export const getCanonicalUrl = (url) => new URL(url).href;

/**
 * Generate cryptographically random string
 * @param {number} [length] - Length of string
 * @returns {string} Random string
 */
export const randomString = (length = 16) =>
  randomBytes(length).toString("base64url").slice(0, length);

/**
 * Get request parameters from either query string or JSON body
 * @param {import("express").Request} request - Request
 * @returns {object} - Request parameters
 */
export const getRequestParameters = (request) => {
  if (Object.entries(request.query).length === 0) {
    return request.body;
  }

  return request.query;
};
