import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { fetch } from "undici";

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
    const { publication } = request.app.locals;
    const { id } = request.params;
    const url = Buffer.from(id, "base64url").toString("utf8");

    const micropubUrl = new URL(publication.micropubEndpoint);
    micropubUrl.searchParams.append("q", "source");
    micropubUrl.searchParams.append("url", url);

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    const micropubResponse = await fetch(micropubUrl.href, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${request.session.access_token}`,
      },
    });

    if (!micropubResponse.ok) {
      throw await IndiekitError.fromFetch(micropubResponse);
    }

    const body = await micropubResponse.json();
    const post = mf2tojf2(body);

    response.render("post", {
      title: post.name,
      post,
      parent: response.__("posts.posts.title"),
    });
  } catch (error) {
    next(error);
  }
};
