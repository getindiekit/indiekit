import { Buffer } from "node:buffer";
import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { micropub } from "../micropub.js";
import { status } from "../status.js";

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
    const { application } = request.app.locals;
    const { scope } = request.session;

    let { page, limit, offset, success } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 12;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const micropubUrl = new URL(application.micropubEndpoint);
    micropubUrl.searchParams.append("q", "source");
    micropubUrl.searchParams.append("page", page);
    micropubUrl.searchParams.append("limit", limit);
    micropubUrl.searchParams.append("offset", offset);

    const micropubResponse = await micropub.get(
      micropubUrl.href,
      request.session.access_token
    );

    let posts;
    if (micropubResponse?.items?.length > 0) {
      const jf2 = mf2tojf2(micropubResponse);
      const items = jf2.children || [jf2];

      posts = items.map((item) => {
        item.classes = item.deleted ? "file-list__item--deleted" : "";
        item.id = Buffer.from(item.url).toString("base64url");
        return item;
      });
    }

    /**
     * @todo Remove requirement for private `_count` parameter
     */
    response.render("posts", {
      title: response.__("posts.posts.title"),
      actions: [
        scope && checkScope(scope, "create")
          ? {
              href: path.join(request.baseUrl + request.path, "/create/"),
              icon: "createPost",
              text: response.__("posts.create.action"),
            }
          : {},
      ],
      posts,
      page,
      limit,
      count: micropubResponse._count,
      parentUrl: request.baseUrl + request.path,
      status,
      success,
    });
  } catch (error) {
    next(error);
  }
};
