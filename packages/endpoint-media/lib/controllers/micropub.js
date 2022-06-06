import httpError from "http-errors";
import { media } from "../media.js";
import { mediaData } from "../media-data.js";
import { checkScope } from "../scope.js";

export const micropubController = {
  /**
   * Query uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async query(request, response, next) {
    const { application, publication } = request.app.locals;

    try {
      if (!application.hasDatabase) {
        throw new httpError.NotImplemented(
          response.__("errors.noDatabase.content")
        );
      }

      let { page, limit, offset, url } = request.query;
      page = Number.parseInt(page, 10) || 1;
      limit = Number.parseInt(limit, 10) || 18;
      offset = Number.parseInt(offset, 10) || (page - 1) * limit;

      const files = await publication.media
        .find()
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit)
        .toArray();

      const items = files.map((media) => media.properties);

      let item;
      if (url) {
        item = await publication.media.findOne({
          "properties.url": url,
        });

        if (!item) {
          throw new httpError.NotFound("No file was found at this URL");
        }
      }

      const { q } = request.query;
      if (!q) {
        throw new httpError.BadRequest("Invalid query");
      }

      switch (q) {
        case "source":
          // Return properties for a given source URL
          if (url) {
            return response.json(item.properties);
          }

          // Return properties for previously published posts
          return response.json({ items });

        default:
          throw new httpError.NotImplemented(`Unsupported parameter: ${q}`);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Upload file
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async upload(request, response, next) {
    const { file } = request;
    const { publication } = request.app.locals;
    const { scope } = request.session;

    try {
      checkScope(scope);

      const data = await mediaData.create(publication, file);
      const uploaded = await media.upload(publication, data, file);

      return response
        .status(uploaded.status)
        .location(uploaded.location)
        .json(uploaded.json);
    } catch (error) {
      next(httpError(error.statusCode, error.message));
    }
  },
};
