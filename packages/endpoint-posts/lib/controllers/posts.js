import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { endpoint } from "../endpoint.js";
import { statusTypes } from "../status-types.js";
import { getPostStatusBadges, getPostId, getPostName } from "../utils.js";

/**
 * List previously published posts
 * @type {import("express").RequestHandler}
 */
export const postsController = async (request, response, next) => {
  try {
    const { application, publication } = request.app.locals;
    const { scope } = request.session;
    const { success } = request.query;
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 12;
    const offset = Number(request.query.offset) || (page - 1) * limit;

    const micropubUrl = new URL(application.micropubEndpoint);
    micropubUrl.searchParams.append("q", "source");
    micropubUrl.searchParams.append("page", String(page));
    micropubUrl.searchParams.append("limit", String(limit));
    micropubUrl.searchParams.append("offset", String(offset));

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
        item.photo = item.photo ? item.photo[0] : false;
        item.description = item.summary || item.content?.text;
        item.title = getPostName(publication, item);
        item.url = path.join(request.baseUrl, request.path, item.id);
        item.badges = getPostStatusBadges(item, response);

        return item;
      });
    }

    /**
     * @todo Remove requirement for private `_count` parameter
     */
    response.render("posts", {
      title: response.locals.__("posts.posts.title"),
      actions: [
        scope && checkScope(scope, "create")
          ? {
              href: path.join(request.baseUrl + request.path, "/create"),
              icon: "createPost",
              text: response.locals.__("posts.create.action"),
            }
          : {},
      ],
      posts,
      page,
      limit,
      count: micropubResponse._count,
      parentUrl: request.baseUrl + request.path,
      statusTypes,
      success,
    });
  } catch (error) {
    next(error);
  }
};
