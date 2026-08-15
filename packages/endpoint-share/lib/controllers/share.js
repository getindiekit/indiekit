import { IndiekitError } from "@indiekit/error";
import { validationResult } from "express-validator";

export const shareController = {
  /**
   * View share page
   * @type {import("express").RequestHandler}
   */
  get(request, response) {
    const { content, name, url, success } = request.query;

    response.render("share", {
      title: response.locals.__("share.title"),
      properties: { content, name, url },
      success,
      minimalui: request.params.path === "bookmarklet",
    });
  },

  /**
   * Post share content
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const { application } = request.app.locals;
    const properties = request.body || {};
    properties["bookmark-of"] = properties.url || properties["bookmark-of"];

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("share", {
        title: response.locals.__("share.title"),
        properties,
        errors: errors.mapped(),
        minimalui: request.params.path === "bookmarklet",
      });
    }

    try {
      const micropubResponse = await fetch(application.micropubEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(properties).toString(),
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      /**
       * @type {object}
       */
      const body = await micropubResponse.json();

      const message = encodeURIComponent(body.success_description);

      response.redirect(`?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("share", {
        title: response.locals.__("share.title"),
        properties,
        error,
        minimalui: request.params.path === "bookmarklet",
      });
    }
  },
};
