/* global Blob */
import { validationResult } from "express-validator";
import { FormData } from "undici";
import { endpoint } from "../endpoint.js";

export const formController = {
  /**
   * Get file to upload
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const { back, scope } = response.locals;

    if (scope.includes("create") || scope.includes("media")) {
      return response.render("file-form", {
        title: response.locals.__("files.upload.title"),
      });
    }

    response.redirect(back);
  },

  /**
   * Post file to media endpoint
   * @type {import("express").RequestHandler}
   */
  async post(request, response) {
    const { mediaEndpoint } = request.app.locals.application;
    const { accessToken } = response.locals;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).render("file-form", {
        title: response.locals.__("files.upload.title"),
        errors: errors.mapped(),
      });
    }

    const { data, name } = request.files.file;
    const formData = new FormData();
    formData.append("file", new Blob([data]), name);

    try {
      const mediaResponse = await endpoint.post(
        mediaEndpoint,
        accessToken,
        formData
      );
      const message = encodeURIComponent(mediaResponse.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("file-form", {
        title: response.locals.__("files.upload.title"),
        error: error.message,
        error_details: error.stack,
      });
    }
  },
};
