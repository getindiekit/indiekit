import { validationResult } from "express-validator";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { jf2ToMf2 } from "@indiekit/endpoint-micropub/lib/mf2.js";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";

export const formController = {
  /**
   * Get post to create/update
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { action, back, postTypeName, scope } = response.locals;

    if (scope && checkScope(scope, action)) {
      return response.render("post-form", {
        title: response.__(`posts.${action}.title`, postTypeName.toLowerCase()),
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
    const { action, accessToken, post, postTypeName } = response.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("post-form", {
        title: response.__(`posts.${action}.title`, postTypeName.toLowerCase()),
        errors: errors.mapped(),
      });
    }

    try {
      const values = request.body;

      // Assign token input `items` property to `categories`
      if (values.items) {
        values.category = values.items;
        delete values.items;
      }

      // Delete empty and ignored values
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key];
          if (!value || value === "_ignore") {
            delete values[key];
          }
        }
      }

      const mf2 = jf2ToMf2(values);

      let jsonBody = mf2;
      if (action === "update") {
        jsonBody = {
          action,
          url: post.url,
          replace: mf2.properties,
        };
      }

      /**
       * @todo Third-party media endpoints may require a separate bearer token
       */
      const micropubResponse = await fetch(application.micropubEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonBody),
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
        title: response.__(`posts.${action}.title`, postTypeName.toLowerCase()),
        error: error.message,
      });
    }
  },
};
