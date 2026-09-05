import { IndiekitError } from "@indiekit/error";

import { getProfileInformation } from "../profile.js";
import { verifyToken } from "../token.js";

/**
 * User information request
 *
 * Return profile information for the user an access token was issued to.
 * @param {object} [options] - Plug-in options
 * @param {object} [options.profile] - Configured profile information
 * @returns {import("express").RequestHandler} Controller
 * @see {@link https://indieauth.spec.indieweb.org/#user-information}
 */
export const userinfoController =
  (options = {}) =>
  async (request, response, next) => {
    try {
      let accessToken;
      try {
        // Remove ‘Bearer ’ from authorization header
        const token = request.headers.authorization?.trim().split(/\s+/, 2)[1];
        accessToken = verifyToken(token);
      } catch {
        throw IndiekitError.unauthorized(
          response.locals.__("UnauthorizedError.invalidToken"),
        );
      }

      const { me, scope } = accessToken;
      if (!scope?.split(" ").includes("profile")) {
        throw IndiekitError.insufficientScope(
          response.locals.__("ForbiddenError.insufficientScope"),
          { scope: "profile" },
        );
      }

      const profile = await getProfileInformation(me, options.profile);

      response.json(profile || {});
    } catch (error) {
      next(error);
    }
  };
