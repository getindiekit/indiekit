import { IndiekitError } from "@indiekit/error";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { fetch } from "undici";
import { getPostData, getPostName } from "../utils.js";

export const deleteController = {
  /**
   * Confirm post to delete/undelete
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { action } = request.params;
    const { access_token, scope } = request.session;

    if (scope && checkScope(scope, action)) {
      const { application, publication } = request.app.locals;
      const { id } = request.params;
      const post = await getPostData(
        id,
        application.micropubEndpoint,
        access_token
      );

      return response.render("post-delete", {
        title: response.__(`posts.${action}.title`),
        parent: { text: getPostName(post, publication) },
        action,
      });
    }

    response.redirect(response.locals.back);
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
    const { action, id } = request.params;
    const { access_token } = request.session;

    try {
      const post = await getPostData(
        id,
        application.micropubEndpoint,
        access_token
      );

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
          authorization: `Bearer ${request.session.access_token}`,
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
        action,
        error: error.message,
      });
    }
  },
};
