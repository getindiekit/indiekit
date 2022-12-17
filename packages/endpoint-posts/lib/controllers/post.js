import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";

/**
 * View previously published post
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @returns {object} HTTP response
 */
export const postController = async (request, response) => {
  const { back, draftMode, post, postName, postStatus, scope } =
    response.locals;

  const postEditable = draftMode ? postStatus === "draft" : true;

  response.render("post", {
    title: postName,
    parent: {
      href: back,
      text: response.__("posts.posts.title"),
    },
    actions: [
      scope && checkScope(scope, "update") && !post.deleted && postEditable
        ? {
            href: path.join(request.originalUrl, "/update"),
            icon: "updatePost",
            text: response.__("posts.update.action"),
          }
        : {},
      scope && checkScope(scope, "delete") && !post.deleted
        ? {
            classes: "actions__link--warning",
            href: path.join(request.originalUrl, "/delete"),
            icon: "delete",
            text: response.__("posts.delete.action"),
          }
        : {},
      scope && checkScope(scope, "undelete") && post.deleted
        ? {
            href: path.join(request.originalUrl, "/undelete"),
            icon: "undelete",
            text: response.__("posts.undelete.action"),
          }
        : {},
    ],
    back: false,
    post,
    redirectUri: path.join(request.baseUrl, request.params.id),
    success: request.query.success,
  });
};
