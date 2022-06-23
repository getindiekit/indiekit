import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";

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
    const url = Buffer.from(id, "base64").toString("utf8");

    const parameters = new URLSearchParams({
      q: "source",
      url,
    }).toString();

    const endpointResponse = await fetch(
      `${publication.micropubEndpoint}?${parameters}`,
      {
        headers: {
          accept: "application/json",
          // TODO: Third-party media endpoint may require a separate token
          authorization: `Bearer ${request.session.token}`,
        },
      }
    );

    if (!endpointResponse.ok) {
      throw await IndiekitError.fromFetch(endpointResponse);
    }

    const body = await endpointResponse.json();
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
