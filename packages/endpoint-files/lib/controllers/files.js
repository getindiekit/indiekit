import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";

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
    const { application } = request.app.locals;

    let { page, limit, offset, success } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 12;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const mediaUrl = new URL(application.mediaEndpoint);
    mediaUrl.searchParams.append("q", "source");
    mediaUrl.searchParams.append("page", page);
    mediaUrl.searchParams.append("limit", limit);
    mediaUrl.searchParams.append("offset", offset);

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
    const files = body.items.map((item) => {
      item.id = Buffer.from(item.url).toString("base64url");
      return item;
    });

    /**
     * @todo Remove requirement for private `_count` parameter
     */
    response.render("files", {
      title: response.__("files.files.title"),
      files,
      page,
      limit,
      count: body._count,
      parentUrl: request.baseUrl + request.path,
      success,
    });
  } catch (error) {
    next(error);
  }
};
