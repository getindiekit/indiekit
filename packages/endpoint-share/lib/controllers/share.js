import { IndiekitError } from "@indiekit/error";
import { validationResult } from "express-validator";

/**
 * Get syndication target `items` for checkboxes component
 * @param {object} publication - Publication configuration
 * @returns {Array<object>} Items for checkboxes component
 */
const getSyndicateToItems = (publication) =>
  publication.syndicationTargets.map((target) => {
    // A target whose `info` can’t be read is shown disabled, with the reason
    let info;
    try {
      info = target.info;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      info = { error: message, service: { name: target.name } };
    }

    return {
      label: info.service?.name,
      ...(info.error
        ? { disabled: true, hint: info.error }
        : { hint: info.uid, value: info.uid }),
    };
  });

export const shareController = {
  /**
   * View share page
   * @type {import("express").RequestHandler}
   */
  get(request, response) {
    const { publication } = request.app.locals;
    const { content, name, url, success } = request.query;

    return response.render("share", {
      title: response.locals.__("share.title"),
      properties: { content, name, url },
      syndicationTargetItems: getSyndicateToItems(publication),
      success,
      minimalui: request.params.path === "bookmarklet",
    });
  },

  /**
   * Post share content
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const { application, publication } = request.app.locals;
    const properties = request.body || {};
    properties["bookmark-of"] = properties.url || properties["bookmark-of"];
    const syndicationTargetItems = getSyndicateToItems(publication);

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("share", {
        title: response.locals.__("share.title"),
        properties,
        syndicationTargetItems,
        errors: errors.mapped(),
        minimalui: request.params.path === "bookmarklet",
      });
    }

    try {
      // `mp-syndicate-to` may hold several targets; each must be sent as its
      // own parameter, as `URLSearchParams` would join an array with commas
      const { "mp-syndicate-to": syndicateTo, ...parameters } = properties;
      const formData = new URLSearchParams(parameters);
      for (const target of [syndicateTo].flat()) {
        if (target) {
          formData.append("mp-syndicate-to", target);
        }
      }

      const micropubResponse = await fetch(application.micropubEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
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
      response.status(error instanceof IndiekitError ? error.status : 500);
      response.render("share", {
        title: response.locals.__("share.title"),
        properties,
        syndicationTargetItems,
        error,
        minimalui: request.params.path === "bookmarklet",
      });
    }
  },
};
