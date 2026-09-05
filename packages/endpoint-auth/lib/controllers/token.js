import { getProfileInformation } from "../profile.js";
import { signToken } from "../token.js";

/**
 * @param {object} [options] - Plug-in options
 * @param {object} [options.profile] - Configured profile information
 * @returns {object} Controller
 */
export const tokenController = (options = {}) => ({
  /**
   * Authorization code request
   *
   * Redeem verified authorization code for an access token.
   * @type {import("express").RequestHandler}
   * @see {@link https://indieauth.spec.indieweb.org/#redeeming-the-authorization-code}
   * @see {@link https://indieauth.spec.indieweb.org/#access-token-response}
   */
  async post(request, response) {
    const { me, scope } = request.verifiedToken;

    const tokenData = { me, ...(scope && { scope }) };
    const accessToken = {
      access_token: signToken(tokenData, "90d"),
      token_type: "Bearer",
      ...tokenData,
    };

    // Include profile information if `profile` scope was granted
    const profile = scope?.split(" ").includes("profile")
      ? await getProfileInformation(me, options.profile)
      : undefined;

    if (request.accepts("application/json")) {
      response.json({ ...accessToken, ...(profile && { profile }) });
    } else {
      // Profile information is only defined for JSON responses
      response.set("content-type", "application/x-www-form-urlencoded");
      response.send(new URLSearchParams(accessToken).toString());
    }
  },
});
