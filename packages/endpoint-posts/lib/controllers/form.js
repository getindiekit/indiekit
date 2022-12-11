import { IndiekitError } from "@indiekit/error";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { validationResult } from "express-validator";
import { fetch } from "undici";

export const formController = {
  /**
   * Get post to create
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { back, postTypeName, scope } = response.locals;

    if (scope && checkScope(scope, "create")) {
      return response.render("post-form", {
        title: response.__("posts.create.title", postTypeName.toLowerCase()),
      });
    }

    response.redirect(back);
  },

  /**
   * Post to Micropub endpoint
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { application } = request.app.locals;
    const { accessToken, postTypeName } = response.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("post-form", {
        title: response.__("posts.create.title", postTypeName.toLowerCase()),
        errors: errors.mapped(),
      });
    }

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    try {
      const properties = request.body;

      // Don’t send `visibility` property if set to ignore
      if (properties.visibility === "_ignore") {
        delete properties.visibility;
      }

      // Assign token input `items` property to `categories`
      if (properties.items) {
        properties.category = properties.items;
        delete properties.items;
      }

      const micropubResponse = await fetch(application.micropubEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(properties).toString(),
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      const body = await micropubResponse.json();
      const message = encodeURIComponent(body.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("post-form", {
        title: response.__("posts.create.title", postTypeName.toLowerCase()),
        error: error.message,
      });
    }
  },
};
