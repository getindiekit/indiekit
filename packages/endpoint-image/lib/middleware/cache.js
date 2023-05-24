/**
 * Send cache control headers in response
 * @type {import("express").RequestHandler}
 */
export function cacheControl(request, response, next) {
  response.set({
    "cache-control": "public, max-age=15552000",
  });

  next();
}
