/* global Blob, FormData */
import { Buffer } from "node:buffer";
import httpError from "http-errors";
import validator from "express-validator";
import { fetch } from "undici";

const { validationResult } = validator;

export const filesController = {
  /**
   * List previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  async files(request, response, next) {
    try {
      const { publication } = request.app.locals;

      let { page, limit, offset, success } = request.query;
      page = Number.parseInt(page, 10) || 1;
      limit = Number.parseInt(limit, 10) || 12;
      offset = Number.parseInt(offset, 10) || (page - 1) * limit;

      const parameters = new URLSearchParams({
        q: "source",
        page,
        limit,
        offset,
      }).toString();

      const endpointResponse = await fetch(
        `${publication.mediaEndpoint}?${parameters}`,
        {
          headers: {
            accept: "application/json",
            // TODO: Third-party media endpoint may require a separate token
            authorization: `Bearer ${request.session.token}`,
          },
        }
      );

      const body = await endpointResponse.json();

      if (!endpointResponse.ok) {
        throw httpError(
          endpointResponse.status,
          body.error_description || endpointResponse.statusText
        );
      }

      const files = body.items.map((item) => {
        item.id = Buffer.from(item.url).toString("base64");
        return item;
      });

      response.render("files", {
        title: response.__("files.files.title"),
        files,
        page,
        limit,
        count: await publication.media.countDocuments(),
        parentUrl: request.baseUrl + request.path,
        success,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * View previously uploaded file
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async file(request, response, next) {
    try {
      const { publication } = request.app.locals;
      const { id } = request.params;
      const url = Buffer.from(id, "base64").toString("utf8");

      const parameters = new URLSearchParams({
        q: "source",
        url,
      }).toString();

      const endpointResponse = await fetch(
        `${publication.mediaEndpoint}?${parameters}`,
        {
          headers: {
            accept: "application/json",
            // TODO: Third-party media endpoint may require a separate token
            authorization: `Bearer ${request.session.token}`,
          },
        }
      );

      const body = await endpointResponse.json();

      if (!endpointResponse.ok) {
        throw httpError(
          endpointResponse.status,
          body.error_description || endpointResponse.statusText
        );
      }

      response.render("file", {
        title: body.filename,
        file: body,
        parent: response.__("files.files.title"),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Upload a new file
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async new(request, response, next) {
    try {
      response.render("upload", {
        title: response.__("files.upload.title"),
        formAction: "/media/upload",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Upload a new file
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @returns {object} HTTP response
   */
  async upload(request, response) {
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
      response.status(422).render("upload", {
        title: response.__("files.upload.title"),
        error: error.message,
      });
    }
  },
};
