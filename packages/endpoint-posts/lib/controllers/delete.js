import { IndiekitError } from "@indiekit/error";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { fetch } from "undici";

export const deleteController = {
  /**
   * Confirm post to delete/undelete
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { action, back, postName, scope } = response.locals;

    if (scope && checkScope(scope, action)) {
      return response.render("post-delete", {
        title: response.__(`posts.${action}.title`),
        parent: { text: postName },
      });
    }

    response.redirect(back);
  },

  /**
   * Post delete/undelete action to Micropub endpoint
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { application } = request.app.locals;
    const { action, accessToken, post } = response.locals;

    try {
      const micropubUrl = new URL(application.micropubEndpoint);
      micropubUrl.searchParams.append("action", action);
      micropubUrl.searchParams.append("url", post.url);

      /**
       * @todo Third-party Micropub endpoints may require a separate bearer token
       */
      const micropubResponse = await fetch(micropubUrl.href, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      const body = await micropubResponse.json();
      const message = encodeURIComponent(body.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("post-delete", {
        title: response.__(`posts.${action}.title`),
        error: error.message,
      });
    }
  },
};
