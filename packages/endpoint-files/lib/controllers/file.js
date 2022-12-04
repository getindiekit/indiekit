import { Buffer } from "node:buffer";
import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
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
    const { application } = request.app.locals;
    const { id } = request.params;
    const url = Buffer.from(id, "base64url").toString("utf8");

    const mediaUrl = new URL(application.mediaEndpoint);
    mediaUrl.searchParams.append("q", "source");
    mediaUrl.searchParams.append("url", url);

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    const mediaResponse = await fetch(mediaUrl.href, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${request.session.access_token}`,
      },
    });

    if (!mediaResponse.ok) {
      throw await IndiekitError.fromFetch(mediaResponse);
    }

    const body = await mediaResponse.json();

    response.render("file", {
      title: body.url ? getFileName(body.url) : "File",
      file: body,
      parent: {
        href: path.dirname(request.baseUrl + request.path),
        text: response.__("files.files.title"),
      },
      actions: [
        {
          classes: "actions__link--warning",
          href: path.join(request.originalUrl, "/delete"),
          icon: "delete",
          text: response.__("files.delete.action"),
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};
