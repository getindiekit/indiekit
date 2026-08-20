import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl } from "@indiekit/util";

import { verifyCode } from "../pkce.js";
import { validateRedirect } from "../redirect.js";
import { verifyToken } from "../token.js";
import { getRequestParameters } from "../utils.js";

/**
 * Validate authorization code before redeeming
 * @type {import("express").RequestHandler}
 */
export const codeValidator = async (request, response, next) => {
  try {
    const { client, usePkce } = request.app.locals;
    const parameters = getRequestParameters(request);
    const { client_id, code, code_verifier, grant_type, redirect_uri } =
      parameters;

    // This middleware guards two routes: the authorization endpoint, where a
    // code is exchanged for a profile URL, and the token endpoint, where it is
    // exchanged for an access token. Clients predating the 2020 specification
    // perform the former without `grant_type` — indieauth.com still does — so
    // accept its omission there. The token endpoint continues to require it.
    const isProfileExchange = request.path === "/";

    // Validate presence of required parameters
    const requiredParameters = ["client_id", "code", "redirect_uri"];
    if (!isProfileExchange) {
      requiredParameters.push("grant_type");
    }

    for (const parameter of requiredParameters) {
      if (!Object.keys(parameters).includes(parameter)) {
        throw IndiekitError.badRequest(
          response.locals.__("BadRequestError.missingParameter", parameter),
        );
      }
    }

    // `grant_type` must equal `authorization_code` where given
    if ((grant_type ?? "authorization_code") !== "authorization_code") {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.invalidValue", "grant_type"),
      );
    }

    // Validate `client_id` against that provided in authorization request
    if (getCanonicalUrl(client_id) !== getCanonicalUrl(client.id)) {
      throw IndiekitError.unauthorized(
        response.locals.__("BadRequestError.invalidValue", "client_id"),
      );
    }

    // Validate `redirect_uri`
    const validRedirect = await validateRedirect(redirect_uri, client_id);
    if (!validRedirect) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.invalidValue", "redirect_uri"),
      );
    }

    // Verify token
    try {
      request.verifiedToken = verifyToken(code);
    } catch {
      throw IndiekitError.unauthorized(
        response.locals.__("UnauthorizedError.invalidToken"),
      );
    }

    // PKCE (Proof Key for Code Exchange)
    if (usePkce) {
      const { code_challenge } = request.verifiedToken;
      const verifiedCode = verifyCode(code_verifier, code_challenge);
      if (!verifiedCode) {
        throw IndiekitError.unauthorized(
          response.locals.__("BadRequestError.invalidValue", "code_verifier"),
        );
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
