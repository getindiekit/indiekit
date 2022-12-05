import path from "node:path";
import { getPostData, getPostName } from "../utils.js";

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

    response.render("post", {
      title: getPostName(post, publication),
      post,
      parent: {
        href: path.dirname(request.baseUrl + request.path),
        text: response.__("posts.posts.title"),
      },
      actions: [
        scope.includes("delete") && post["post-status"] !== "deleted"
          ? {
              classes: "actions__link--warning",
              href: path.join(request.originalUrl, "/delete"),
              icon: "delete",
              text: response.__("posts.delete.action"),
            }
          : {},
      ],
    });
  } catch (error) {
    next(error);
  }
};
