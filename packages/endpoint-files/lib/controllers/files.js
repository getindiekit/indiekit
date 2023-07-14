import path from "node:path";
import { endpoint } from "../endpoint.js";
import { getFileId, getFileName } from "../utils.js";

/**
 * List uploaded files
 * @type {import("express").RequestHandler}
 */
export const filesController = async (request, response, next) => {
  try {
    const { application } = request.app.locals;
    const { access_token, scope } = request.session;
    const { after, before, success } = request.query;
    const limit = Number(request.query.limit) || 20;

    const mediaUrl = new URL(application.mediaEndpoint);
    mediaUrl.searchParams.append("q", "source");
    mediaUrl.searchParams.append("limit", String(limit));

    if (after) {
      mediaUrl.searchParams.append("after", String(after));
    }

    if (before) {
      mediaUrl.searchParams.append("before", String(before));
    }

    const mediaResponse = await endpoint.get(mediaUrl.href, access_token);

    let files;
    if (mediaResponse?.items?.length > 0) {
      files = mediaResponse.items.map((item) => {
        item.id = getFileId(item.url);
        item.icon = item["media-type"];
        item.photo = {
          url: item.url,
        };
        item.title = item.url ? getFileName(item.url) : "File";
        item.url = path.join(request.baseUrl, request.path, item.id);

        return item;
      });
    }

    const cursor = {};

    if (mediaResponse?.paging?.after) {
      cursor.next = {
        href: `?after=${mediaResponse.paging.after}`,
      };
    }

    if (mediaResponse?.paging?.before) {
      cursor.previous = {
        href: `?before=${mediaResponse.paging.before}`,
      };
    }

    response.render("files", {
      title: response.locals.__("files.files.title"),
      actions: [
        scope.includes("create") || scope.includes("media")
          ? {
              href: path.join(request.baseUrl + request.path, "/upload"),
              icon: "uploadFile",
              text: response.locals.__("files.upload.action"),
            }
          : {},
      ],
      cursor,
      files,
      limit,
      success,
    });
  } catch (error) {
    next(error);
  }
};
