import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isUrl } from "@indiekit/util";
import { getClientInformation } from "../client.js";
import { createRequestUri } from "../pushed-authorization-request.js";
import { validateRedirect } from "../redirect.js";

export const authorizationController = {
  /**
   * Authorization request
   *
   * Validate parameters in request before redirecting to consent form
   * where the user is prompted to authenticate themselves.
   * @type {import("express").RequestHandler}
   * @see {@link https://indieauth.spec.indieweb.org/#authorization-request}
   * @see {@link https://indieauth.spec.indieweb.org/#authorization-response}
   */
  async get(request, response, next) {
    try {
      const { application } = request.app.locals;

      // If no parameters provided, show service documentation
      if (Object.entries(request.query).length === 0) {
        return next(true);
      }

      // Validate presence of required parameters
      for (const parameter of [
        "client_id",
        "redirect_uri",
        "response_type",
        "state",
      ]) {
        if (!request.query[parameter]) {
          throw IndiekitError.badRequest(
            response.locals.__("BadRequestError.missingParameter", parameter)
          );
        }
      }

      // `response_type` must be `code` (or deprecated `id`)
      if (!/^(code|id)$/.test(String(request.query.response_type))) {
        throw IndiekitError.badRequest(
          response.locals.__("BadRequestError.invalidValue", "response_type")
        );
      }

      // `client_id`, `redirect_uri` and `me` (optional) must be valid URLs
      for (const uri of ["client_id", "me", "redirect_uri"]) {
        if (request.query[uri] && !isUrl(request.query[uri])) {
          throw IndiekitError.badRequest(
            response.locals.__("BadRequestError.invalidValue", uri)
          );
        }

        // Canonicalise URLs for later comparison
        if (request.query[uri]) {
          request.query[uri] = getCanonicalUrl(String(request.query[uri]));
        }
      }

      const { code_challenge, code_challenge_method, redirect_uri, client_id } =
        request.query;

      // Validate `redirect_uri`
      const validRedirect = validateRedirect(redirect_uri, client_id);
      if (!validRedirect) {
        throw IndiekitError.badRequest(
          response.locals.__("BadRequestError.invalidValue", "redirect_uri")
        );
      }

      // Add client information to locals
      request.app.locals.client = await getClientInformation(String(client_id));

      // Use PKCE if code challenge parameters provided
      request.app.locals.usePkce = code_challenge && code_challenge_method;

      // Create Pushed Authorization Request (PAR) URI
      const requestUri = createRequestUri(request);

      // Build authorization URL and redirect to consent form
      const consentUrl = new URL(`${request.baseUrl}/consent`, application.url);

      response.redirect(`${consentUrl.href}?request_uri=${requestUri}`);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Authorization code request
   *
   * Redeem verified authorization code for a profile URL.
   * @type {import("express").RequestHandler}
   * @see {@link https://indieauth.spec.indieweb.org/#redeeming-the-authorization-code}
   * @see {@link https://indieauth.spec.indieweb.org/#profile-url-response}
   */
  async post(request, response) {
    const profileToken = { me: request.verifiedToken.me };

    if (request.accepts("application/json")) {
      response.json(profileToken);
    } else {
      response.set("content-type", "application/x-www-form-urlencoded");
      response.send(new URLSearchParams(profileToken).toString());
    }
  },
};
