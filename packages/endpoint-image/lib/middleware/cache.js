/**
 * Send cache control headers in response
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 */
export function cacheControl(request, response, next) {
  response.set({
    "cache-control": "public, max-age=15552000",
  });

  next();
}
