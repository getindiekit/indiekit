import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { endpoint } from "../endpoint.js";

export const deleteController = {
  /**
   * Confirm post to delete/undelete
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const { action, postName, postsPath, scope } = response.locals;

    if (scope && checkScope(scope, action)) {
      return response.render("post-delete", {
        title: response.locals.__(`posts.${action}.title`),
        parent: { text: postName },
      });
    }

    response.redirect(postsPath);
  },

  /**
   * Post delete/undelete action to Micropub endpoint
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const { micropubEndpoint } = request.app.locals.application;
    const { action, accessToken, post, postName } = response.locals;

    try {
      const micropubUrl = new URL(micropubEndpoint);
      micropubUrl.searchParams.append("action", action);
      micropubUrl.searchParams.append("url", post.url);

      const micropubResponse = await endpoint.post(
        micropubUrl.href,
        accessToken
      );
      const message = encodeURIComponent(micropubResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("post-delete", {
        title: response.locals.__(`posts.${action}.title`),
        parent: { text: postName },
        error,
      });
    }
  },
};
