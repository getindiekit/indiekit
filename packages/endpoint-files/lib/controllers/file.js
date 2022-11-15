import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
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
    const url = Buffer.from(id, "base64url").toString("utf8");

    const parameters = new URLSearchParams({
      q: "source",
      url,
    }).toString();

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    const mediaResponse = await fetch(
      `${publication.mediaEndpoint}?${parameters}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${request.session.access_token}`,
        },
      }
    );

    if (!mediaResponse.ok) {
      throw await IndiekitError.fromFetch(mediaResponse);
    }

    const body = await mediaResponse.json();

    response.render("file", {
      title: body.filename,
      file: body,
      parent: response.__("files.files.title"),
    });
  } catch (error) {
    next(error);
  }
};
