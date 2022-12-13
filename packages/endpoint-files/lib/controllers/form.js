/* global Blob */
import path from "node:path";
import { validationResult } from "express-validator";
import { FormData } from "undici";
import { endpoint } from "../endpoint.js";

export const formController = {
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
      return response.render("file-form", {
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
    const { mediaEndpoint } = request.app.locals.application;
    const { access_token } = request.session;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("file-form", {
        title: response.__("files.upload.title"),
        back: path.dirname(request.baseUrl + request.path),
        errors: errors.mapped(),
      });
    }

    const { data, name } = request.files.file;
    const formData = new FormData();
    formData.append("file", new Blob([data]), name);

    try {
      const mediaResponse = await endpoint.post(
        mediaEndpoint,
        access_token,
        formData
      );
      const message = encodeURIComponent(mediaResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("file-form", {
        title: response.__("files.upload.title"),
        back: path.dirname(request.baseUrl + request.path),
        error: error.message,
      });
    }
  },
};
