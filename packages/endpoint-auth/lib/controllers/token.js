import { IndiekitError } from "@indiekit/error";
import { signToken, verifyToken } from "../token.js";

export const tokenController = {
  /**
   * Verify bearer token
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @param {Function} next - Next middleware callback
   * @returns {object} HTTP response
   */
  get(request, response, next) {
    try {
      // If no authorization header, show service documentation
      if (!request.headers.authorization) {
        return next(true);
      }

      // Remove ‘Bearer ’ from authorization header
      const bearerToken = request.headers.authorization.trim().split(/\s+/)[1];

      // Verify JSON Web Token
      let accessToken;
      try {
        accessToken = verifyToken(bearerToken);
      } catch {
        throw IndiekitError.unauthorized(
          response.__("UnauthorizedError.invalidToken")
        );
      }

      if (request.accepts("application/json")) {
        response.json(accessToken);
      } else {
        response.set("content-type", "application/x-www-form-urlencoded");
        response.send(new URLSearchParams(accessToken).toString());
      }
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Authorization code request
   *
   * Redeem verified authorization code for an access token.
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   * @see {@link https://indieauth.spec.indieweb.org/#redeeming-the-authorization-code}
   * @see {@link https://indieauth.spec.indieweb.org/#access-token-response}
   */
  post(request, response) {
    const { me, scope } = request.verifiedToken;

    const tokenData = { me, ...(scope && { scope }) };
    const accessToken = {
      access_token: signToken(tokenData, "90d"),
      token_type: "Bearer",
      ...tokenData,
    };

    if (request.accepts("application/json")) {
      response.json(accessToken);
    } else {
      response.set("content-type", "application/x-www-form-urlencoded");
      response.send(new URLSearchParams(accessToken).toString());
    }
  },
};
