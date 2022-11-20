import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import { validationResult } from "express-validator";

export const shareController = {
  /**
   * View share page
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   */
  get(request, response) {
    const { content, name, url, success } = request.query;

    response.render("share", {
      title: response.__("share.title"),
      content,
      name,
      url,
      success,
      minimalui: request.params.path === "bookmarklet",
    });
  },

  /**
   * Post share content
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { application } = request.app.locals;
    const { content, name } = request.body;
    const bookmarkOf = request.body.url || request.body["bookmark-of"];

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("share", {
        title: response.__("share.title"),
        name,
        content,
        "bookmark-of": bookmarkOf,
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
        body: new URLSearchParams(request.body).toString(),
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      const body = await micropubResponse.json();
      const message = encodeURIComponent(body.success_description);

      response.redirect(`?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("share", {
        title: response.__("share.title"),
        content,
        name,
        bookmarkOf,
        error: error.message,
        minimalui: request.params.path === "bookmarklet",
      });
    }
  },
};
