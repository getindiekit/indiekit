import path from "node:path";
import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { endpoint } from "../endpoint.js";
import { statusTypes } from "../status-types.js";
import { getPostStatusBadges, getPostId, getPostName } from "../utils.js";

/**
 * List published posts
 * @type {import("express").RequestHandler}
 */
export const postsController = async (request, response, next) => {
  try {
    const { application, publication } = request.app.locals;
    const { access_token, scope } = request.session;
    const { after, before, success } = request.query;
    const limit = Number(request.query.limit) || 12;

    const micropubUrl = new URL(application.micropubEndpoint);
    micropubUrl.searchParams.append("q", "source");
    micropubUrl.searchParams.append("limit", String(limit));

    if (after) {
      micropubUrl.searchParams.append("after", String(after));
    }

    if (before) {
      micropubUrl.searchParams.append("before", String(before));
    }

    const micropubResponse = await endpoint.get(micropubUrl.href, access_token);

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

    const cursor = {};

    if (micropubResponse?.paging?.after) {
      cursor.next = {
        href: `?after=${micropubResponse.paging.after}`,
      };
    }

    if (micropubResponse?.paging?.before) {
      cursor.previous = {
        href: `?before=${micropubResponse.paging.before}`,
      };
    }

    response.render("posts", {
      title: response.locals.__("posts.posts.title"),
      actions: [
        scope && checkScope(scope, "create")
          ? {
              href: path.join(request.baseUrl + request.path, "/new"),
              icon: "createPost",
              text: response.locals.__("posts.create.action"),
            }
          : {},
      ],
      cursor,
      posts,
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
