import { Buffer } from "node:buffer";
import httpError from "http-errors";

export const mediaController = {
  /**
   * List previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  async files(request, response, next) {
    if (!request.accepts("html")) {
      return next();
    }

    try {
      const { publication } = request.app.locals;

      let { page, limit, offset } = request.query;
      page = Number.parseInt(page, 10) || 1;
      limit = Number.parseInt(limit, 10) || 6;
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
        title: response.__("media.files.title"),
        files,
        page,
        limit,
        count: await publication.media.countDocuments(),
        parentUrl: request.baseUrl + request.path,
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
        parent: response.__("media.files.title"),
        file: body,
      });
    } catch (error) {
      next(error);
    }
  },
};
