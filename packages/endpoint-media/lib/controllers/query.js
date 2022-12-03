import { IndiekitError } from "@indiekit/error";

/**
 * Query uploaded files
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const queryController = async (request, response, next) => {
  const { application, publication } = request.app.locals;

  try {
    if (!application.hasDatabase) {
      throw IndiekitError.notImplemented(
        response.__("NotImplementedError.database")
      );
    }

    let { page, limit, offset } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 18;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const files = await publication.media
      .find()
      .project({
        "properties.content-type": 1,
        "properties.post-type": 1,
        "properties.published": 1,
        "properties.url": 1,
      })
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const { q, url } = request.query;
    if (!q) {
      throw IndiekitError.badRequest(
        response.__("BadRequestError.missingParameter", "q")
      );
    }

    let item;
    if (url) {
      item = await publication.media.findOne(
        { "properties.url": url },
        {
          projection: {
            "properties.content-type": 1,
            "properties.post-type": 1,
            "properties.published": 1,
            "properties.url": 1,
          },
        }
      );

      if (!item) {
        throw IndiekitError.notFound(
          response.__("NotFoundError.resource", "file")
        );
      }
    }

    switch (q) {
      case "source": {
        // Return properties for a given source URL
        if (url) {
          return response.json(item.properties);
        }

        // Return properties for previously uploaded files
        return response.json({
          _count: await publication.media.countDocuments(),
          items: files.map((media) => media.properties),
        });
      }

      default: {
        throw IndiekitError.notImplemented(
          response.__("NotImplementedError.query", { key: "q", value: q })
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
