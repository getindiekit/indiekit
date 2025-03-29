import process from "node:process";

import { IndiekitError } from "@indiekit/error";
import { validationResult } from "express-validator";

import { getRequestUriData } from "../pushed-authorization-request.js";
import { getScopeItems } from "../scope.js";
import { signToken } from "../token.js";

export const consentController = {
  /**
   * View consent form
   * @type {import("express").RequestHandler}
   */
  get(request, response) {
    if (!request.query.request_uri) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.missingParameter", "request_uri"),
      );
    }

    try {
      const { me, redirect_uri, scope } = getRequestUriData(request);
      const authType = scope === undefined ? "authenticate" : "authorize";

      if (process.env.PASSWORD_SECRET) {
        response.render("consent", {
          title: response.locals.__(`auth.consent.${authType}.title`),
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
        response.locals.__("BadRequestError.invalidValue", "request_uri"),
      );
    }
  },

  /**
   * Submit consent form
   * @type {import("express").RequestHandler}
   * @see {@link https://indieauth.spec.indieweb.org/#authorization-response}
   */
  post(request, response) {
    const { application } = request.app.locals;

    let scope = request.body?.scope;
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
        title: response.locals.__(`auth.consent.${authType}.title`),
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
      jti: crypto.randomUUID(),
      me,
      redirect_uri,
      ...(scope && { scope }),
    });

    // Authorization response
    const redirect = new URL(redirect_uri);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("iss", application.url);
    redirect.searchParams.set("state", state);

    // If client sent optional `me` value  in initial authorization request,
    // add it to response. This is for backwards compatibility with clients
    // conforming to older versions of the IndieAuth spec.
    if (me) {
      redirect.searchParams.set("me", me);
    }

    response.redirect(redirect.href);
  },
};
