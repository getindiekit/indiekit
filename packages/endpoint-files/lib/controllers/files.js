import { Buffer } from "node:buffer";
import path from "node:path";
import { endpoint } from "../endpoint.js";
import { getFileName } from "../utils.js";

/**
 * List previously uploaded files
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const filesController = async (request, response, next) => {
  try {
    const { application, publication } = request.app.locals;
    const { scope } = request.session;
    const { access_token } = request.session;

    let { page, limit, offset, success } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 20;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const imageUrl = new URL(application.imageEndpoint, application.url);

    const mediaUrl = new URL(application.mediaEndpoint);
    mediaUrl.searchParams.append("q", "source");
    mediaUrl.searchParams.append("page", page);
    mediaUrl.searchParams.append("limit", limit);
    mediaUrl.searchParams.append("offset", offset);

    const mediaResponse = await endpoint.get(mediaUrl.href, access_token);

    const files = mediaResponse.items.map((item) => {
      item.id = Buffer.from(item.url).toString("base64url");
      item.icon = item["post-type"];
      item.photo = {
        attributes: { onerror: "this.src='/assets/not-found.svg'" },
        src:
          item.url.replace(publication.me, imageUrl.href) +
          "?w=240&h=240&c=true",
      };
      item.title = item.url ? getFileName(item.url) : "File";
      item.url = path.join(request.baseUrl, request.path, item.id);
      return item;
    });

    /**
     * @todo Remove requirement for private `_count` parameter
     */
    response.render("files", {
      title: response.__("files.files.title"),
      actions: [
        scope.includes("create") || scope.includes("media")
          ? {
              href: path.join(request.baseUrl + request.path, "/new/"),
              icon: "uploadFile",
              text: response.__("files.upload.action"),
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
