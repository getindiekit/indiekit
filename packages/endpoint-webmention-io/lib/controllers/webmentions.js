import { IndiekitError } from "@indiekit/error";

/**
 * List webmentions
 * @type {import("express").RequestHandler}
 */
export const webmentionsController = async (request, response, next) => {
  try {
    const { application, publication } = request.app.locals;
    const domain = new URL(publication.me).hostname;
    const limit = Number(request.query.limit) || 20;
    const page = Number(request.query.page) || 0;

    const endpointUrl = new URL("https://webmention.io");
    // TODO: Pass token in top-level function param
    endpointUrl.searchParams.append("token", process.env.WEBMENTION_IO_TOKEN);
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

    // TODO: Use custom component for webmentions
    let webmentions;
    if (body?.children?.length > 0) {
      webmentions = body.children.map((item) => {
        item.id = item["wm-id"];
        item.icon = "reply";
        item.locale = application.locale;
        item.description = item.content?.text;
        item.title = item.author.name;

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
