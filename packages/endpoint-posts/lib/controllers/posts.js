import path from "node:path";

import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { excerpt } from "@indiekit/util";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";

import { endpoint } from "../endpoint.js";
import { statusTypes } from "../status-types.js";
import { getPostStatusBadges, getPostName, getPhotoUrl } from "../utils.js";

/**
 * List published posts
 * @type {import("express").RequestHandler}
 */
export const postsController = async (request, response, next) => {
  try {
    const { application, publication } = request.app.locals;
    const access_token = request.session?.access_token;
    const scope = request.session?.scope;
    const { after, before, success } = request.query;
    const limit = Number(request.query.limit) || 12;
    const postType = String(request.query["post-type"] || "");
    const filter = String(request.query.filter || "");

    // Filters are passed to Micropub and kept when paging
    const filters = new URLSearchParams();
    if (postType) {
      filters.set("post-type", postType);
    }

    if (filter) {
      filters.set("filter", filter);
    }

    const micropubUrl = new URL(application.micropubEndpoint);
    micropubUrl.searchParams.append("q", "source");
    micropubUrl.searchParams.append("limit", String(limit));
    for (const [key, value] of filters) {
      micropubUrl.searchParams.append(key, value);
    }

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
        item.id = item.uid;
        item.icon = item["post-type"];
        item.locale = application.locale;
        item.photo = getPhotoUrl(publication, item);
        item.description = {
          text:
            item.summary ||
            (item.content?.text &&
              excerpt(item.content.text, 30, publication.locale)),
        };
        item.title = getPostName(publication, item);
        item.url = path.join(request.baseUrl, request.path, item.uid);
        item.badges = getPostStatusBadges(item, response);

        return item;
      });
    }

    const cursor = {};
    const pageHref = (key, value) => {
      const parameters = new URLSearchParams(filters);
      parameters.set(key, value);
      return `?${parameters}`;
    };

    if (micropubResponse?.paging?.after) {
      cursor.next = {
        href: pageHref("after", micropubResponse.paging.after),
      };
    }

    if (micropubResponse?.paging?.before) {
      cursor.previous = {
        href: pageHref("before", micropubResponse.paging.before),
      };
    }

    const postTypeItems = [
      { value: "", text: response.locals.__("posts.posts.allPostTypes") },
      ...Object.entries(publication.postTypes).map(([type, { name }]) => ({
        value: type,
        text: name,
        selected: type === postType,
      })),
    ];

    return response.render("posts", {
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
      filter,
      filtered: filters.size > 0,
      postTypeItems,
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
