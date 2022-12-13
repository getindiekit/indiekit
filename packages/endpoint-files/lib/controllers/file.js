import { Buffer } from "node:buffer";
import path from "node:path";
import { endpoint } from "../endpoint.js";
import { getFileName } from "../utils.js";

/**
 * View previously uploaded file
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const fileController = async (request, response, next) => {
  try {
    const { mediaEndpoint } = request.app.locals.application;
    const { id } = request.params;
    const { access_token, scope } = request.session;
    const url = Buffer.from(id, "base64url").toString("utf8");

    const mediaUrl = new URL(mediaEndpoint);
    mediaUrl.searchParams.append("q", "source");
    mediaUrl.searchParams.append("url", url);

    const mediaResponse = await endpoint.get(mediaUrl.href, access_token);

    response.render("file", {
      title: getFileName(mediaResponse.url),
      file: mediaResponse,
      parent: {
        href: path.dirname(request.baseUrl + request.path),
        text: response.__("files.files.title"),
      },
      actions: [
        scope.includes("delete")
          ? {
              classes: "actions__link--warning",
              href: path.join(request.originalUrl, "/delete"),
              icon: "delete",
              text: response.__("files.delete.action"),
            }
          : {},
      ],
    });
  } catch (error) {
    next(error);
  }
};
