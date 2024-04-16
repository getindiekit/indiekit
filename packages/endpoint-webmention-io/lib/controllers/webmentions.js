import { IndiekitError } from "@indiekit/error";

import {
  getAuthorName,
  getMentionTitle,
  getMentionType,
  sanitiseHtml,
} from "../utils.js";

/**
 * List webmentions
 * @param {object} options - Endpoint options
 * @param {string} options.token - Access token
 * @returns {import("express").RequestHandler} - Controller
 */
export const webmentionsController = (options) => {
  return async (request, response, next) => {
    try {
      const { application, publication } = request.app.locals;
      const domain = new URL(publication.me).hostname;
      const limit = Number(request.query.limit) || 20;
      const page = Number(request.query.page) || 0;

      const endpointUrl = new URL("https://webmention.io");
      endpointUrl.searchParams.append("token", options.token);
      endpointUrl.searchParams.append("domain", domain);
      endpointUrl.searchParams.append("per-page", String(limit));
      endpointUrl.pathname = "api/mentions.jf2";

      if (page) {
        endpointUrl.searchParams.append("page", String(page));
      }

      const endpointResponse = await fetch(endpointUrl.href, {
        headers: {
          accept: "application/json",
        },
      });

      if (!endpointResponse.ok) {
        throw await IndiekitError.fromFetch(endpointResponse);
      }

      const body = await endpointResponse.json();

      let webmentions;
      if (body?.children?.length > 0) {
        webmentions = body.children.map((item) => {
          let html;
          if (item.content?.html) {
            html = sanitiseHtml(item.content.html);
          } else if (item.content?.text) {
            html = `<p>${item.content.text}</p>`;
          }

          item.id = item["wm-id"];
          item.icon = getMentionType(item["wm-property"]);
          item.locale = application.locale;
          item.title = getMentionTitle(item);
          item.description = { html };
          item.published = item.published || item["wm-received"];
          item.user = {
            avatar: { src: item.author.photo },
            name: getAuthorName(item),
            url: item.author.url,
          };

          return item;
        });
      }

      const cursor = {};

      cursor.next = {
        href: `?page=${page + 1}`,
      };

      if (Number(page) > 0) {
        cursor.previous = {
          href: `?page=${page - 1}`,
        };
      }

      response.render("webmentions", {
        title: response.locals.__("webmention-io.title"),
        webmentions,
        cursor,
      });
    } catch (error) {
      next(error);
    }
  };
};
