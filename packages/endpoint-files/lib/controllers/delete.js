import { Buffer } from "node:buffer";
import path from "node:path";
import { endpoint } from "../endpoint.js";
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

      return response.render("file-delete", {
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
    const { mediaEndpoint } = request.app.locals.application;
    const { url } = request.body;
    const { access_token } = request.session;

    const mediaUrl = new URL(mediaEndpoint);
    mediaUrl.searchParams.append("action", "delete");
    mediaUrl.searchParams.append("url", url);

    try {
      const mediaResponse = await endpoint.post(mediaUrl.href, access_token);
      const message = encodeURIComponent(mediaResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("file-delete", {
        title: response.__("files.delete.title"),
        back: path.dirname(request.baseUrl + request.path),
        parent: { text: getFileName(url) },
        error: error.message,
      });
    }
  },
};
