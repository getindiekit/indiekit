import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";

export const newController = {
  /**
   * Get new post type to create
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const action = "create";
    const { application, publication } = request.app.locals;
    const postsPath = path.dirname(request.baseUrl + request.path);
    const postType = request.query.type || "article";
    const { scope } = request.session;

    const postTypeItems = publication.postTypes
      .filter((postType) =>
        application.supportedPostTypes.includes(postType.type)
      )
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      .map((postType) => ({
        text: postType.name,
        value: postType.type,
      }));

    response.locals = {
      action,
      postsPath,
      postType,
      postTypeItems,
      scope,
      ...response.locals,
    };

    if (scope && checkScope(scope, action)) {
      return response.render("new", {
        title: response.locals.__(`posts.new.title`),
      });
    }

    response.redirect(postsPath);
  },

  /**
   * Redirect to post creation form for selected post type
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    try {
      const { type } = request.body;

      response.redirect(`${request.baseUrl}/create?type=${type}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("new", {
        title: response.locals.__(`posts.new.title`),
        error,
      });
    }
  },
};
