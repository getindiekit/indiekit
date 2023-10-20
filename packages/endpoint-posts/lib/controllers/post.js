import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";

/**
 * View published post
 * @type {import("express").RequestHandler}
 */
export const postController = async (request, response) => {
  const { draftMode, postName, postsPath, postStatus, properties, scope } =
    response.locals;

  const postEditable = draftMode ? postStatus === "draft" : true;

  response.render("post", {
    title: postName,
    parent: {
      href: postsPath,
      text: response.locals.__("posts.posts.title"),
    },
    actions: [
      scope &&
      checkScope(scope, "update") &&
      !properties.deleted &&
      postEditable
        ? {
            href: path.join(request.baseUrl + request.path, "/update"),
            icon: "updatePost",
            text: response.locals.__("posts.update.action"),
          }
        : {},
      scope && checkScope(scope, "delete") && !properties.deleted
        ? {
            classes: "actions__link--warning",
            href: path.join(request.baseUrl + request.path, "/delete"),
            icon: "delete",
            text: response.locals.__("posts.delete.action"),
          }
        : {},
      scope && checkScope(scope, "undelete") && properties.deleted
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
