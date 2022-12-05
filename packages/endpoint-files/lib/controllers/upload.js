/* global Blob */
import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { validationResult } from "express-validator";
import { fetch, FormData } from "undici";

export const uploadController = {
  /**
   * Get file to upload
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { scope } = request.session;
    const back = path.dirname(request.baseUrl + request.path);

    if (scope.includes("create") || scope.includes("media")) {
      return response.render("upload", {
        title: response.__("files.upload.title"),
        back,
      });
    }

    response.redirect(back);
  },

  /**
   * Post file to media endpoint
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { application } = request.app.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("upload", {
        title: response.__("files.upload.title"),
        back: path.dirname(request.baseUrl + request.path),
        errors: errors.mapped(),
      });
    }

    const { data, name } = request.files.file;
    const formData = new FormData();
    formData.append("file", new Blob([data]), name);

    /**
     * @todo Third-party media endpoints may require a separate bearer token
     */
    try {
      const mediaResponse = await fetch(application.mediaEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${request.session.access_token}`,
        },
        body: formData,
      });

      if (!mediaResponse.ok) {
        throw await IndiekitError.fromFetch(mediaResponse);
      }

      const body = await mediaResponse.json();
      const message = encodeURIComponent(body.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("upload", {
        title: response.__("files.upload.title"),
        back: path.dirname(request.baseUrl + request.path),
        error: error.message,
      });
    }
  },
};
