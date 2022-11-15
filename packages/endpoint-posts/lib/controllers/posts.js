import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { fetch } from "undici";

/**
 * List previously published posts
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const postsController = async (request, response, next) => {
  try {
    const { publication } = request.app.locals;

    let { page, limit, offset, success } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 12;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const parameters = new URLSearchParams({
      q: "source",
      page,
      limit,
      offset,
    }).toString();

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    const endpointResponse = await fetch(
      `${publication.micropubEndpoint}?${parameters}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${request.session.access_token}`,
        },
      }
    );

    if (!endpointResponse.ok) {
      throw await IndiekitError.fromFetch(endpointResponse);
    }

    const body = await endpointResponse.json();
    let posts;
    if (body?.items?.length > 0) {
      const mf2 = mf2tojf2(body);
      const items = mf2.children ? mf2.children : [mf2];
      posts = items.map((item) => {
        item.id = Buffer.from(item.url).toString("base64url");
        return item;
      });
    }

    /**
     * @todo Remove requirement for private `_count` parameter
     */
    response.render("posts", {
      title: response.__("posts.posts.title"),
      posts,
      page,
      limit,
      count: body._count,
      parentUrl: request.baseUrl + request.path,
      success,
    });
  } catch (error) {
    next(error);
  }
};
