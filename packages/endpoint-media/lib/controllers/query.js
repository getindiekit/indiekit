import { IndiekitError } from "@indiekit/error";
import { getCursor } from "@indiekit/util";

import { getMediaProperties } from "../utils.js";

/**
 * @typedef {object} QueryParameters
 * @property {string} [after] - Return items after this item ID
 * @property {string} [before] - Return items before this item ID
 * @property {string} [limit] - Number of items to return
 * @property {string} [q] - Query
 * @property {string} [url] - URL of post to return
 */

/**
 * Query uploaded files
 * @type {import("express").RequestHandler<Record<string, string>, unknown, unknown, QueryParameters>}
 */
export const queryController = async (request, response, next) => {
  const { application } = request.app.locals;
  const mediaCollection = application.collections.get("media");

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

          if (mediaCollection) {
            mediaData = await mediaCollection.findOne({
              "properties.url": url,
            });
          }

          if (!mediaData) {
            throw IndiekitError.badRequest(
              response.locals.__("BadRequestError.missingResource", "file"),
            );
          }

          return response.json(getMediaProperties(mediaData));
        }
        // Return properties for all uploaded files
        let cursor = {
          items: [],
          hasNext: false,
          hasPrev: false,
        };

        if (mediaCollection) {
          cursor = await getCursor(mediaCollection, after, before, limit);
        }

        return response.json({
          items: cursor.items.map((mediaData) => getMediaProperties(mediaData)),
          paging: {
            ...(cursor.hasNext && { after: cursor.lastItem }),
            ...(cursor.hasPrev && { before: cursor.firstItem }),
          },
        });
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
