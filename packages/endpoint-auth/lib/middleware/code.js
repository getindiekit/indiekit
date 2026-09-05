import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl } from "@indiekit/util";

import { verifyCode } from "../pkce.js";
import { verifyToken } from "../token.js";
import { getRequestParameters } from "../utils.js";

/**
 * Validate authorization code before redeeming
 * @type {import("express").RequestHandler}
 */
export const codeValidator = async (request, response, next) => {
  try {
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

    // Verify the code before reading anything from it
    try {
      request.verifiedToken = verifyToken(code);
    } catch {
      throw IndiekitError.unauthorized(
        response.locals.__("UnauthorizedError.invalidToken"),
      );
    }

    // An authorization code records the client it was issued to and the
    // redirect it was issued for. A code missing either cannot be checked
    // against the request, so it is not one this server issued.
    if (
      !request.verifiedToken.client_id ||
      !request.verifiedToken.redirect_uri
    ) {
      throw IndiekitError.unauthorized(
        response.locals.__("UnauthorizedError.invalidToken"),
      );
    }

    // Validate `client_id` against the client the code was issued to. Reading
    // it from the code, rather than from state shared across requests, is what
    // ties this exchange to the authorization request that produced the code.
    if (
      getCanonicalUrl(client_id) !==
      getCanonicalUrl(String(request.verifiedToken.client_id))
    ) {
      throw IndiekitError.unauthorized(
        response.locals.__("BadRequestError.invalidValue", "client_id"),
      );
    }

    // Validate `redirect_uri` against the one the code was issued for. It was
    // checked against the client's metadata during the authorization request,
    // so matching it here is what remains to be done.
    if (redirect_uri !== request.verifiedToken.redirect_uri) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.invalidValue", "redirect_uri"),
      );
    }

    // PKCE (Proof Key for Code Exchange). Whether it applies is recorded in
    // the code itself, by the presence of the challenge it was issued with.
    const { code_challenge } = request.verifiedToken;
    if (code_challenge) {
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
