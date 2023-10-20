import { IndiekitError } from "@indiekit/error";
import { getCursor } from "@indiekit/util";
import { getMediaProperties } from "../utils.js";

/**
 * Query uploaded files
 * @type {import("express").RequestHandler}
 */
export const queryController = async (request, response, next) => {
  const { application } = request.app.locals;

  try {
    const limit = Number(request.query.limit) || 0;
    const { after, before, q, url } = request.query;

    if (!q) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.missingParameter", "q"),
      );
    }

    switch (q) {
      case "source": {
        if (url) {
          // Return properties for a given URL
          let mediaData;

          if (application.hasDatabase) {
            mediaData = await application.media.findOne({
              "properties.url": url,
            });
          }

          if (!mediaData) {
            throw IndiekitError.badRequest(
              response.locals.__("BadRequestError.missingResource", "file"),
            );
          }

          response.json(getMediaProperties(mediaData));
        } else {
          // Return properties for all uploaded files
          let cursor = {
            items: [],
            hasNext: false,
            hasPrev: false,
          };

          if (application.hasDatabase) {
            cursor = await getCursor(application.media, after, before, limit);
          }

          response.json({
            items: cursor.items.map((mediaData) =>
              getMediaProperties(mediaData),
            ),
            paging: {
              ...(cursor.hasNext && { after: cursor.lastItem }),
              ...(cursor.hasPrev && { before: cursor.firstItem }),
            },
          });
        }

        break;
      }

      default: {
        throw IndiekitError.notImplemented(
          response.locals.__("NotImplementedError.query", {
            key: "q",
            value: q,
          }),
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
