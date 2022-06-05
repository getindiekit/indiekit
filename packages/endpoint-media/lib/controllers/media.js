import httpError from "http-errors";
import mongodb from "mongodb";

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
    try {
      const { application, publication } = request.app.locals;

      if (!application.hasDatabase) {
        throw new httpError.NotImplemented(
          response.__("errors.noDatabase.content")
        );
      }

      let { page, limit, offset } = request.query;
      page = Number.parseInt(page, 10) || 1;
      limit = Number.parseInt(limit, 10) || 18;
      offset = Number.parseInt(offset, 10) || (page - 1) * limit;

      const files = await publication.media
        .find()
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit)
        .toArray();

      if (request.accepts("html")) {
        response.render("files", {
          title: response.__("media.files.title"),
          files,
          page,
          limit,
          count: await publication.media.countDocuments(),
          parentUrl: request.baseUrl + request.path,
        });
      } else {
        const { q } = request.query;
        const items = files.map((media) => media.properties);

        if (!q) {
          throw new httpError.BadRequest("Invalid query");
        }

        switch (q) {
          case "source":
            return response.json({ items });

          default:
            throw new httpError.NotImplemented(`Unsupported parameter: ${q}`);
        }
      }
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
      const file = await publication.media.findOne({
        _id: new mongodb.ObjectId(id),
      });

      if (!file) {
        throw new httpError.NotFound("No file was found with this UUID");
      }

      response.render("file", {
        parent: response.__("media.files.title"),
        file,
      });
    } catch (error) {
      next(error);
    }
  },
};
