import path from "node:path";

import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";

/**
 * View published post
 * @type {import("express").RequestHandler}
 */
export const postController = async (request, response) => {
  const { isDraftMode, postName, postsPath, postStatus, properties, scope } =
    response.locals;

  const isPostEditable = isDraftMode ? postStatus === "draft" : true;

  response.render("post", {
    title: postName,
    parent: {
      href: postsPath,
      text: response.locals.__("posts.posts.title"),
    },
    actions: [
      scope &&
      isPostEditable &&
      !properties.deleted &&
      checkScope(scope, "update")
        ? {
            href: path.join(request.baseUrl + request.path, "/update"),
            icon: "updatePost",
            text: response.locals.__("posts.update.action"),
          }
        : {},
      scope && !properties.deleted && checkScope(scope, "delete")
        ? {
            classes: "actions__link--warning",
            href: path.join(request.baseUrl + request.path, "/delete"),
            icon: "delete",
            text: response.locals.__("posts.delete.action"),
          }
        : {},
      scope && properties.deleted && checkScope(scope, "undelete")
        ? {
            href: path.join(request.baseUrl + request.path, "/undelete"),
            icon: "undelete",
            text: response.locals.__("posts.undelete.action"),
          }
        : {},
    ],
    redirectUri: path.join(request.baseUrl, request.params.uid),
    success: request.query.success,
  });
};
