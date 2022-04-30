import HttpError from "http-errors";
import mongodb from "mongodb";

export const filesController = {
  /**
   * List previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  async list(request, response, next) {
    try {
      const { application, publication } = request.app.locals;

      if (!application.hasDatabase) {
        throw new Error(response.__("errors.noDatabase.content"));
      }

      const page = Number.parseInt(request.query.page, 10) || 1;
      const limit = Number.parseInt(request.query.limit, 10) || 18;
      const skip = (page - 1) * limit;

      const files = await publication.media
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const count = await publication.media.countDocuments();

      response.render("files", {
        title: response.__("media.files.title"),
        files,
        page,
        limit,
        count,
        parentUrl: `${request.originalUrl}/`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * View previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async view(request, response, next) {
    try {
      const { publication } = request.app.locals;
      const { id } = request.params;
      const file = await publication.media.findOne({
        _id: new mongodb.ObjectId(id),
      });

      if (!file) {
        throw new HttpError(404, "No file was found with this UUID");
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
