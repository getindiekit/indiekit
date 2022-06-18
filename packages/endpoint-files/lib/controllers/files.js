import { Buffer } from "node:buffer";
import httpError from "http-errors";
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
    const { publication } = request.app.locals;

    let { page, limit, offset, success } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 12;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const parameters = new URLSearchParams({
      q: "source",
      page,
      limit,
      offset,
    }).toString();

    const endpointResponse = await fetch(
      `${publication.mediaEndpoint}?${parameters}`,
      {
        headers: {
          accept: "application/json",
          // TODO: Third-party media endpoint may require a separate token
          authorization: `Bearer ${request.session.token}`,
        },
      }
    );

    const body = await endpointResponse.json();

    if (!endpointResponse.ok) {
      throw httpError(
        endpointResponse.status,
        body.error_description || endpointResponse.statusText
      );
    }

    const files = body.items.map((item) => {
      item.id = Buffer.from(item.url).toString("base64");
      return item;
    });

    response.render("files", {
      title: response.__("files.files.title"),
      files,
      page,
      limit,
      count: body._count, // TODO: Remove requirement for private parameter
      parentUrl: request.baseUrl + request.path,
      success,
    });
  } catch (error) {
    next(error);
  }
};
