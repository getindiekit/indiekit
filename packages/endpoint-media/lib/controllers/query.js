import httpError from "http-errors";
import { queryList } from "../query.js";

/**
 * Query endpoint
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Next middleware callback
 * @returns {object} HTTP response
 */
export const queryController = async (request, response, next) => {
  const { publication } = request.app.locals;
  const { query } = request;
  const { filter, limit, offset } = query;

  try {
    if (!query.q) {
      throw new Error("Invalid query");
    }

    switch (query.q) {
      case "source": {
        // Return previously uploaded media
        const items = publication.media
          ? await publication.media
              .find()
              .map((media) => media.properties)
              .toArray()
          : [];
        return response.json({
          items: queryList(items, { filter, limit, offset }),
        });
      }

      default:
        throw new Error(`Unsupported parameter: ${query.q}`);
    }
  } catch (error) {
    next(httpError(400, error));
  }
};
