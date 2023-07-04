import { randomBytes } from "node:crypto";

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
