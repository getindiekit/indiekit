import { signToken } from "../token.js";

export const tokenController = {
  /**
   * Authorization code request
   *
   * Redeem verified authorization code for an access token.
   * @type {import("express").RequestHandler}
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
