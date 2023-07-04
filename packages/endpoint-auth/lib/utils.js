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
