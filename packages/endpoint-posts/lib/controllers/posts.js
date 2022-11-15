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

    const micropubUrl = new URL(publication.micropubEndpoint);
    micropubUrl.searchParams.append("q", "source");
    micropubUrl.searchParams.append("page", page);
    micropubUrl.searchParams.append("limit", limit);
    micropubUrl.searchParams.append("offset", offset);

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
