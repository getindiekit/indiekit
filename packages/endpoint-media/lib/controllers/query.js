import httpError from "http-errors";

/**
 * Query uploaded files
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Next middleware callback
 * @returns {object} HTTP response
 */
export const queryController = async (request, response, next) => {
  const { application, publication } = request.app.locals;

  try {
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

    const { q, url } = request.query;
    if (!q) {
      throw new httpError.BadRequest("Invalid query");
    }

    let item;
    if (url) {
      item = await publication.media.findOne({ "properties.url": url });

      if (!item) {
        throw new httpError.NotFound("No file was found at this URL");
      }
    }

    switch (q) {
      case "source":
        // Return properties for a given source URL
        if (url) {
          return response.json(item.properties);
        }

        // Return properties for previously uploaded files
        return response.json({
          items: files.map((media) => media.properties),
        });

      default:
        throw new httpError.NotImplemented(`Unsupported parameter: ${q}`);
    }
  } catch (error) {
    next(error);
  }
};
