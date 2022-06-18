import { Buffer } from "node:buffer";
import httpError from "http-errors";
import { fetch } from "undici";

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
    const { publication } = request.app.locals;
    const { id } = request.params;
    const url = Buffer.from(id, "base64").toString("utf8");

    const parameters = new URLSearchParams({
      q: "source",
      url,
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

    response.render("file", {
      title: body.filename,
      file: body,
      parent: response.__("files.files.title"),
    });
  } catch (error) {
    next(error);
  }
};
