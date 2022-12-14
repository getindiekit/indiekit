import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { endpoint } from "../endpoint.js";
import { status } from "../status.js";
import { getPostId, getPostName } from "../utils.js";

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
    const { application, publication } = request.app.locals;
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

    const micropubResponse = await endpoint.get(
      micropubUrl.href,
      request.session.access_token
    );

    let posts;
    if (micropubResponse?.items?.length > 0) {
      const jf2 = mf2tojf2(micropubResponse);
      const items = jf2.children || [jf2];

      posts = items.map((item) => {
        item.id = getPostId(item.url);
        item.icon = item["post-type"];
        item.photo = item.photo
          ? {
              attributes: { onerror: "this.src='/assets/not-found.svg'" },
              ...item.photo[0],
            }
          : false;
        item.description = item.summary || item.content?.text;
        item.title = getPostName(publication, item);
        item.url = path.join(request.baseUrl, request.path, item.id);
        item.badges = [
          ...(item["post-status"]
            ? [
                {
                  color: status[item["post-status"]].color,
                  size: "small",
                  text: response.__(status[item["post-status"]].text),
                },
              ]
            : []),
          ...(item.deleted
            ? [
                {
                  color: status.deleted.color,
                  size: "small",
                  text: response.__(status.deleted.text),
                },
              ]
            : []),
        ];

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
