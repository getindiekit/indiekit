import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, isSameOrigin } from "@indiekit/util";

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

      // Deprecated exception for indieauth.com
      // indieauth.com omits `response_type`, the pre-specification form of an
      // authentication-only request (`id`). Its replacement, indielogin.com,
      // sends `response_type=code` and needs none of this. `client_id` is not
      // yet known to be a URL, so it is checked before being compared.
      // @see {@link https://github.com/aaronpk/IndieAuth.com/blob/main/controllers/auth-web.rb#L518}
      const clientId = String(request.query.client_id);
      const isDeprecatedClient =
        URL.canParse(clientId) &&
        isSameOrigin(clientId, "https://indieauth.com");
      const responseType =
        request.query.response_type ?? (isDeprecatedClient ? "id" : undefined);

      // Validate presence of required parameters
      const requiredParameters = {
        client_id: request.query.client_id,
        redirect_uri: request.query.redirect_uri,
        response_type: responseType,
        state: request.query.state,
      };

      for (const [parameter, value] of Object.entries(requiredParameters)) {
        if (value === undefined) {
          throw IndiekitError.badRequest(
            response.locals.__("BadRequestError.missingParameter", parameter),
          );
        }
      }

      // `response_type` must be `code` (or deprecated `id`)
      if (!/^(code|id)$/.test(String(responseType))) {
        throw IndiekitError.badRequest(
          response.locals.__("BadRequestError.invalidValue", "response_type"),
        );
      }

      // `client_id`, `redirect_uri` and `me` (optional) must be valid URLs
      for (const parameter of ["client_id", "me", "redirect_uri"]) {
        let uri = request.query[parameter];

        if (uri && !URL.canParse(String(uri))) {
          throw IndiekitError.badRequest(
            response.locals.__("BadRequestError.invalidValue", parameter),
          );
        }

        // Canonicalise URLs for later comparison
        if (uri) {
          uri = getCanonicalUrl(String(uri));
        }
      }

      const { code_challenge, code_challenge_method, redirect_uri, client_id } =
        request.query;

      // Validate `redirect_uri`
      const validRedirect = await validateRedirect(
        String(redirect_uri),
        String(client_id),
      );
      if (!validRedirect) {
        throw IndiekitError.badRequest(
          response.locals.__("BadRequestError.invalidValue", "redirect_uri"),
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
