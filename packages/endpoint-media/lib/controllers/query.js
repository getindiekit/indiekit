import { IndiekitError } from "@indiekit/error";

/**
 * Query uploaded files
 * @type {import("express").RequestHandler}
 */
export const queryController = async (request, response, next) => {
  const { application } = request.app.locals;

  try {
    const limit = Number(request.query.limit) || 0;
    const offset = Number(request.query.offset) || 0;
    const { q, url } = request.query;

    if (!q) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.missingParameter", "q")
      );
    }

    switch (q) {
      case "source": {
        if (!application.hasDatabase) {
          throw IndiekitError.notImplemented(
            response.locals.__("NotImplementedError.database")
          );
        }

        if (url) {
          // Return properties for a given URL
          const item = await application.media.findOne(
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
              response.locals.__("NotFoundError.resource", "file")
            );
          }

          response.json(item.properties);
        } else {
          // Return properties for all previously uploaded files
          const files = await application.media
            .find()
            .project({
              "properties.content-type": 1,
              "properties.post-type": 1,
              "properties.published": 1,
              "properties.url": 1,
            })
            .sort({ "properties.published": -1 })
            .skip(offset)
            .limit(limit)
            .toArray();

          response.json({
            _count: await application.media.countDocuments(),
            items: files.map((media) => media.properties),
          });
        }

        break;
      }

      default: {
        throw IndiekitError.notImplemented(
          response.locals.__("NotImplementedError.query", {
            key: "q",
            value: q,
          })
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
