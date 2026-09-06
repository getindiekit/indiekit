import path from "node:path";

import { IndiekitError } from "@indiekit/error";
import { validationResult } from "express-validator";

import { endpoint } from "../endpoint.js";

export const formController = {
  /**
   * Get file to upload
   * @type {import("express").RequestHandler}
   */
  async get(request, response) {
    const { filesPath, scope } = response.locals;

    if (scope.includes("create") || scope.includes("media")) {
      return response.render("file-form", {
        back: {
          href: path.dirname(request.baseUrl + request.path),
        },
        title: response.locals.__("files.upload.title"),
      });
    }

    response.redirect(filesPath);
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

    // Caught by validation, but needed to satisfy nullable UploadedFile typedef
    if (!request.files?.file) {
      throw new Error(response.locals.__("files.error.file.empty"));
    }

    // One file or several; upload in turn, as a content store may not
    // accept concurrent writes
    const files = [request.files.file].flat();
    const uploaded = [];
    let lastError;

    for (const { data, name } of files) {
      const formData = new FormData();
      formData.append("file", new Blob([new Uint8Array(data)]), name);

      try {
        uploaded.push(
          await endpoint.post(mediaEndpoint, accessToken, formData),
        );
      } catch (error) {
        lastError = error;
      }
    }

    if (uploaded.length === 0) {
      response.status(
        lastError instanceof IndiekitError ? lastError.status : 500,
      );
      return response.render("file-form", {
        title: response.locals.__("files.upload.title"),
        error: lastError,
      });
    }

    let message;
    if (files.length === 1) {
      message = uploaded[0].success_description;
    } else if (uploaded.length === files.length) {
      message = response.locals.__(
        "files.upload.success",
        String(files.length),
      );
    } else {
      message = response.locals.__(
        "files.upload.partial",
        String(uploaded.length),
        String(files.length),
      );
    }

    response.redirect(
      `${request.baseUrl}?success=${encodeURIComponent(message)}`,
    );
  },
};
