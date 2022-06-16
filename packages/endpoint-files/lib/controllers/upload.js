/* global Blob, FormData */
import httpError from "http-errors";
import validator from "express-validator";
import { fetch } from "undici";

const { validationResult } = validator;

export const uploadController = {
  /**
   * Get file to upload
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async get(request, response, next) {
    response.render("upload", {
      title: response.__("files.upload.title"),
    });
  },

  /**
   * Post file to media endpoint
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
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

    const { buffer, originalname } = request.file;
    const formData = new FormData();
    formData.append("file", new Blob([buffer]), originalname);

    try {
      const endpointResponse = await fetch(publication.mediaEndpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          // TODO: Third-party media endpoint may require a separate token
          authorization: `Bearer ${request.session.token}`,
        },
        body: formData,
      });

      const body = await endpointResponse.json();

      if (!endpointResponse.ok) {
        throw httpError(
          endpointResponse.status,
          body.error_description || endpointResponse.statusText
        );
      }

      const message = encodeURIComponent(body.success_description);
      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status).render("upload", {
        title: response.__("files.upload.title"),
        error: error.message,
      });
    }
  },
};
