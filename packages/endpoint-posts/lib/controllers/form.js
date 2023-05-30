import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { jf2ToMf2 } from "@indiekit/endpoint-micropub/lib/mf2.js";
import { validationResult } from "express-validator";
import { endpoint } from "../endpoint.js";
import { getLocationProperty } from "../utils.js";

export const formController = {
  /**
   * Get post to create/update
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const { action, back, postTypeName, scope } = response.locals;

    if (scope && checkScope(scope, action)) {
      return response.render("post-form", {
        title: response.locals.__(
          `posts.${action}.title`,
          postTypeName.toLowerCase()
        ),
      });
    }

    response.redirect(back);
  },

  /**
   * Post to Micropub endpoint
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const { micropubEndpoint } = request.app.locals.application;
    const { action, accessToken, post, postTypeName } = response.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("post-form", {
        title: response.locals.__(
          `posts.${action}.title`,
          postTypeName.toLowerCase()
        ),
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

      // Convert geo string into object
      if (values.geo) {
        values.location = getLocationProperty(values.geo);
        delete values.geo;
      }

      // Delete empty values
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key) && !values[key]) {
          delete values[key];
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

      const micropubResponse = await endpoint.post(
        micropubEndpoint,
        accessToken,
        jsonBody
      );
      const message = encodeURIComponent(micropubResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("post-form", {
        title: response.locals.__(
          `posts.${action}.title`,
          postTypeName.toLowerCase()
        ),
        error: error.message,
        error_details: error.stack,
      });
    }
  },
};
