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
  const { back, post, postName, postStatus, scope } = response.locals;

  response.render("post", {
    title: postName,
    parent: {
      href: back,
      text: response.__("posts.posts.title"),
    },
    actions: [
      scope && checkScope(scope, "delete") && postStatus !== "deleted"
        ? {
            classes: "actions__link--warning",
            href: path.join(request.originalUrl, "/delete"),
            icon: "delete",
            text: response.__("posts.delete.action"),
          }
        : {},
      scope && checkScope(scope, "undelete") && postStatus === "deleted"
        ? {
            href: path.join(request.originalUrl, "/undelete"),
            icon: "undelete",
            text: response.__("posts.undelete.action"),
          }
        : {},
    ],
    back: false,
    post,
  });
};
