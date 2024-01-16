import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { jf2ToMf2 } from "@indiekit/endpoint-micropub/lib/mf2.js";
import {
  getTimeZoneDesignator,
  getTimeZoneOffset,
  sanitise,
} from "@indiekit/util";
import { validationResult } from "express-validator";
import { endpoint } from "../endpoint.js";
import { getLocationProperty } from "../utils.js";

export const formController = {
  /**
   * Get post to create/update
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const { action, postsPath, postType, postTypeName, scope } =
      response.locals;

    if (scope && checkScope(scope, action)) {
      return response.render("post-form", {
        back:
          action === "create"
            ? {
                href: `${path.join(postsPath, "new")}?type=${postType}`,
                text: response.locals.__(`posts.form.back`),
              }
            : {
                href: path.dirname(request.baseUrl + request.path),
              },
        title: response.locals.__(
          `posts.${action}.title`,
          postTypeName.toLowerCase().replace("rsvp", "RSVP"),
        ),
      });
    }

    response.redirect(postsPath);
  },

  /**
   * Post to Micropub endpoint
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const { micropubEndpoint, timeZone } = request.app.locals.application;
    const { accessToken, action, postTypeName, properties } = response.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("post-form", {
        title: response.locals.__(
          `posts.${action}.title`,
          postTypeName.toLowerCase().replace("rsvp", "RSVP"),
        ),
        errors: errors.mapped(),
      });
    }

    try {
      const values = request.body;
      if (values["publication-date"] === "now") {
        // Remove empty local date value and let server set date
        delete values.published;
      } else {
        // Add timezone designator to local date value
        const timeZoneOffsetMinutes = getTimeZoneOffset(
          timeZone,
          values.published,
        );
        const timeZoneDesignator = getTimeZoneDesignator(timeZoneOffsetMinutes);
        values.published = values.published + timeZoneDesignator;
      }

      // Convert category value to Array
      if (values.category) {
        try {
          // Entered using progressively enhanced tag input, for example:
          // `["foo", "bar"]`
          values.category = JSON.parse(values.category);
        } catch {
          // Entered using comma separated values, for example:
          // `foo, bar`
          values.category = values.category
            .split(",")
            .map((category) => (category = category.trim()));
        }
      }

      // Convert media values object to Array
      for (const key of ["audio", "photo", "video"]) {
        if (values[key]) {
          values[key] = Object.values(values[key]);
        }
      }

      // Derive location from location and/or geo values
      if (values.location || values.geo) {
        values.location = getLocationProperty(values);
      }

      const mf2 = jf2ToMf2({ properties: sanitise(values) });

      let jsonBody = mf2;
      if (action === "update") {
        jsonBody = {
          action,
          url: properties.url,
          replace: mf2.properties,
        };
      }

      const micropubResponse = await endpoint.post(
        micropubEndpoint,
        accessToken,
        jsonBody,
      );
      const message = encodeURIComponent(micropubResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("post-form", {
        title: response.locals.__(
          `posts.${action}.title`,
          postTypeName.toLowerCase().replace("rsvp", "RSVP"),
        ),
        error,
      });
    }
  },
};
