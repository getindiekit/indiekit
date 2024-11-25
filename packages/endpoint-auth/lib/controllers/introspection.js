import { verifyToken } from "../token.js";

export const introspectionController = {
  /**
   * Access token verification request
   *
   * Redeem verified authorization code for a profile URL.
   * @type {import("express").RequestHandler}
   * @see {@link https://indieauth.spec.indieweb.org/#access-token-verification}
   */
  post(request, response) {
    try {
      let token = request.body?.token;

      if (!token) {
        // Remove ‘Bearer ’ from authorization header
        token = request.headers.authorization.trim().split(/\s+/)[1];
      }

      let accessToken = verifyToken(token);
      accessToken = {
        active: true,
        ...accessToken,
      };

      response.json(accessToken);
    } catch {
      response.json({
        active: false,
      });
    }
  },
};
