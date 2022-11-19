import process from "node:process";
import { IndiekitError } from "@indiekit/error";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { getRequestUriData } from "../pushed-authorization-request.js";
import { getScopeItems } from "../scope.js";
import { signToken } from "../token.js";

export const consentController = {
  /**
   * View consent form
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  get(request, response) {
    if (!request.query.request_uri) {
      throw IndiekitError.badRequest(
        response.__("BadRequestError.missingParameter", "request_uri")
      );
    }

    try {
      const { me, redirect_uri, scope } = getRequestUriData(request);
      const authType = scope === undefined ? "authenticate" : "authorize";

      if (process.env.PASSWORD_SECRET) {
        response.render("consent", {
          title: response.__(`auth.consent.${authType}.title`),
          authType,
          me,
          redirect_uri,
          scopeItems: getScopeItems(scope, response),
        });
      } else {
        response.redirect(request.baseUrl + "/new-password?setup=true");
      }
    } catch {
      throw IndiekitError.badRequest(
        response.__("BadRequestError.invalidValue", "request_uri")
      );
    }
  },

  /**
   * Submit consent form
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   * @see {@link https://indieauth.spec.indieweb.org/#authorization-response}
   */
  post(request, response) {
    let { scope } = request.body;
    const {
      client_id,
      code_challenge,
      code_challenge_method,
      me,
      redirect_uri,
      state,
    } = getRequestUriData(request);
    const authType = scope === undefined ? "authenticate" : "authorize";

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("consent", {
        title: response.__(`auth.consent.${authType}.title`),
        authType,
        errors: errors.mapped(),
        me,
        redirect_uri,
        scopeItems: getScopeItems(scope, response),
      });
    }

    // Scopes should be a space separated list
    if (scope) {
      scope = Array.isArray(scope) ? scope : [scope];
      scope = scope.join(" ");
    }

    // Create authorization code
    const code = signToken({
      client_id,
      ...(code_challenge && { code_challenge }),
      ...(code_challenge_method && { code_challenge_method }),
      jti: uuidv4(),
      me,
      redirect_uri,
      ...(scope && { scope }),
    });

    // Authorization response
    const redirect = new URL(redirect_uri);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("iss", client_id);
    redirect.searchParams.set("state", state);

    response.redirect(redirect.href);
  },
};
