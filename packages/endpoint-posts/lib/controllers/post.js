import path from "node:path";
import { getPermissions, getPostData, getPostName } from "../utils.js";

/**
 * View previously published post
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const postController = async (request, response, next) => {
  try {
    const { access_token, scope } = request.session;
    const { application, publication } = request.app.locals;
    const { id } = request.params;
    const post = await getPostData(
      id,
      application.micropubEndpoint,
      access_token
    );
    const permissions = getPermissions(scope, post);

    response.render("post", {
      title: getPostName(post, publication),
      post,
      parent: {
        href: path.dirname(request.baseUrl + request.path),
        text: response.__("posts.posts.title"),
      },
      actions: [
        permissions.canDelete
          ? {
              classes: "actions__link--warning",
              href: path.join(request.originalUrl, "/delete"),
              icon: "delete",
              text: response.__("posts.delete.action"),
            }
          : {},
        permissions.canUndelete
          ? {
              href: path.join(request.originalUrl, "/undelete"),
              icon: "undelete",
              text: response.__("posts.undelete.action"),
            }
          : {},
      ],
    });
  } catch (error) {
    next(error);
  }
};
