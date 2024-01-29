import path from "node:path";
import { validationResult } from "express-validator";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";

export const newController = {
  /**
   * Get new post type to create
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const action = "create";
    const { publication } = request.app.locals;
    const postsPath = path.dirname(request.baseUrl + request.path);
    const postType = request.query.type;
    const { scope } = request.session;

    const postTypeItems = Object.values(publication.postTypes)
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      .map((postType) => ({
        label: postType.name,
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
        back: {
          href: postsPath,
        },
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
    const { publication } = request.app.locals;
    const postsPath = path.dirname(request.baseUrl + request.path);

    const postTypeItems = Object.values(publication.postTypes)
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      .map((postType) => ({
        label: postType.name,
        value: postType.type,
      }));

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("new", {
        title: response.locals.__(`posts.new.title`),
        postsPath,
        postTypeItems,
        errors: errors.mapped(),
      });
    }

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
