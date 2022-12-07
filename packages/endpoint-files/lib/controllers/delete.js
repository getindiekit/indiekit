import { Buffer } from "node:buffer";
import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import { getFileName } from "../utils.js";

export const deleteController = {
  /**
   * Confirm file to delete
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { scope } = request.session;
    const back = path.dirname(request.baseUrl + request.path);

    if (scope.includes("delete")) {
      const { id } = request.params;
      const url = Buffer.from(id, "base64url").toString("utf8");

      return response.render("file-confirm-delete", {
        title: response.__("files.delete.title"),
        back,
        parent: { text: getFileName(url) },
        url,
      });
    }

    response.redirect(back);
  },

  /**
   * Post delete action to media endpoint
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { application } = request.app.locals;
    const { url } = request.body;

    const mediaUrl = new URL(application.mediaEndpoint);
    mediaUrl.searchParams.append("action", "delete");
    mediaUrl.searchParams.append("url", url);

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    try {
      const mediaResponse = await fetch(mediaUrl.href, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${request.session.access_token}`,
        },
      });

      if (!mediaResponse.ok) {
        throw await IndiekitError.fromFetch(mediaResponse);
      }

      const body = await mediaResponse.json();
      const message = encodeURIComponent(body.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("file-confirm-delete", {
        title: response.__("files.delete.title"),
        back: path.dirname(request.baseUrl + request.path),
        parent: { text: getFileName(url) },
        error: error.message,
      });
    }
  },
};
