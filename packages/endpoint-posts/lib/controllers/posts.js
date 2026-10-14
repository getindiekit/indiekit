import path from "node:path";

import { checkScope } from "@indiekit/endpoint-micropub/lib/scope.js";
import { excerpt } from "@indiekit/util";
import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";

import { endpoint } from "../endpoint.js";
import { statusTypes } from "../status-types.js";
import { getPostStatusBadges, getPostName, getPhotoUrl } from "../utils.js";

/**
 * Get plain text from a JF2 `content` value
 * @param {Jf2Value} content - JF2 `content` value
 * @returns {string|undefined} Plain text
 */
const getContentText = (content) => {
  if (typeof content === "string") {
    return content;
  }

  if (typeof content === "object" && !Array.isArray(content)) {
    return typeof content.text === "string" ? content.text : undefined;
  }
};

/**
 * List published posts
 * @param {Request} request - Express request
 * @param {Response} response - Express response
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
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
    const parentUrl = request.baseUrl + request.path;

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
        const uid = String(item.uid);
        const contentText = getContentText(item.content);

        item.id = uid;
        item.icon = item["post-type"];
        item.locale = application.locale;
        item.photo = getPhotoUrl(publication, item);
        item.description = {
          text:
            item.summary ||
            (contentText && excerpt(contentText, 30, publication.locale)),
        };
        item.title = getPostName(publication, item);
        item.url = path.join(request.baseUrl, request.path, uid);
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

    // One link per post type, plus one for all of them. Other filters are
    // kept; `after` and `before` are not in `filters`, so a cursor naming an
    // item in the result set being left behind is dropped by construction.
    const postTypeHref = (type) => {
      const parameters = new URLSearchParams(filters);

      if (type) {
        parameters.set("post-type", type);
      } else {
        parameters.delete("post-type");
      }

      return parameters.size > 0 ? `?${parameters}` : parentUrl;
    };

    const postTypeItems = [
      {
        href: postTypeHref(""),
        text: response.locals.__("posts.posts.allPostTypes"),
        attributes: { "aria-current": postType ? undefined : "true" },
      },
      ...Object.entries(publication.postTypes).map(([type, { name }]) => ({
        href: postTypeHref(type),
        text: name,
        attributes: { "aria-current": type === postType ? "true" : undefined },
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
      postType,
      postTypeItems,
      posts,
      limit,
      count: micropubResponse?._count,
      parentUrl,
      statusTypes,
      success,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @import { Jf2Value } from "@paulrobertlloyd/mf2tojf2"
 * @import { NextFunction, Request, Response } from "express"
 */
