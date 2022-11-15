/* global Blob */
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
    response.render("upload", {
      title: response.__("files.upload.title"),
    });
  },

  /**
   * Post file to media endpoint
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { publication } = request.app.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("upload", {
        title: response.__("files.upload.title"),
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
      const mediaResponse = await fetch(publication.mediaEndpoint, {
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
        error: error.message,
      });
    }
  },
};
