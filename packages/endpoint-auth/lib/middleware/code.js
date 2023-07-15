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
export const codeValidator = (request, response, next) => {
  try {
    const { client, usePkce } = request.app.locals;
    const parameters = getRequestParameters(request);
    const { client_id, code, code_verifier, grant_type, redirect_uri } =
      parameters;

    // Validate presence of required parameters
    for (const parameter of [
      "client_id",
      "code",
      "grant_type",
      "redirect_uri",
    ]) {
      if (!Object.keys(parameters).includes(parameter)) {
        throw IndiekitError.badRequest(
          response.locals.__("BadRequestError.missingParameter", parameter)
        );
      }
    }

    // `grant_type` must equal `authorization_code`
    if (grant_type !== "authorization_code") {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.invalidValue", "grant_type")
      );
    }

    // Validate `client_id` against that provided in authorization request
    if (getCanonicalUrl(client_id) !== getCanonicalUrl(client.url)) {
      throw IndiekitError.unauthorized(
        response.locals.__("BadRequestError.invalidValue", "client_id")
      );
    }

    // Validate `redirect_uri`
    const validRedirect = validateRedirect(redirect_uri, client_id);
    if (!validRedirect) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.invalidValue", "redirect_uri")
      );
    }

    // Verify token
    try {
      request.verifiedToken = verifyToken(code);
    } catch {
      throw IndiekitError.unauthorized(
        response.locals.__("UnauthorizedError.invalidToken")
      );
    }

    // PKCE (Proof Key for Code Exchange)
    if (usePkce) {
      const { code_challenge } = request.verifiedToken;
      const verifiedCode = verifyCode(code_verifier, code_challenge);
      if (!verifiedCode) {
        throw IndiekitError.unauthorized(
          response.locals.__("BadRequestError.invalidValue", "code_verifier")
        );
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
