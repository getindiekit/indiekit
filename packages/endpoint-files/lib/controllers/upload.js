/* global Blob */
import { IndiekitError } from "@indiekit/error";
import validator from "express-validator";
import { fetch, FormData } from "undici";

const { validationResult } = validator;

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

    try {
      const endpointResponse = await fetch(publication.mediaEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          // TODO: Third-party media endpoint may require a separate token
          authorization: `Bearer ${request.session.access_token}`,
        },
        body: formData,
      });

      if (!endpointResponse.ok) {
        throw await IndiekitError.fromFetch(endpointResponse);
      }

      const body = await endpointResponse.json();
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
