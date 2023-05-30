import path from "node:path";
import { endpoint } from "../endpoint.js";
import { getFileId, getFileName } from "../utils.js";

/**
 * List previously uploaded files
 * @type {import("express").RequestHandler}
 */
export const filesController = async (request, response, next) => {
  try {
    const { application } = request.app.locals;
    const { access_token, scope } = request.session;
    const { success } = request.query;
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 20;
    const offset = Number(request.query.offset) || (page - 1) * limit;

    const mediaUrl = new URL(application.mediaEndpoint);
    mediaUrl.searchParams.append("q", "source");
    mediaUrl.searchParams.append("page", String(page));
    mediaUrl.searchParams.append("limit", String(limit));
    mediaUrl.searchParams.append("offset", String(offset));

    const mediaResponse = await endpoint.get(mediaUrl.href, access_token);

    const files = mediaResponse.items.map((item) => {
      item.id = getFileId(item.url);
      item.icon = item["post-type"];
      item.photo = {
        url: item.url,
      };
      item.title = item.url ? getFileName(item.url) : "File";
      item.url = path.join(request.baseUrl, request.path, item.id);
      return item;
    });

    /**
     * @todo Remove requirement for private `_count` parameter
     */
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
      files,
      page,
      limit,
      count: mediaResponse._count,
      success,
    });
  } catch (error) {
    next(error);
  }
};
