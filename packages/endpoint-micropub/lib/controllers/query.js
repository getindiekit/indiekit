import httpError from "http-errors";
import { getMf2Properties, jf2ToMf2, url2Mf2 } from "../mf2.js";
import { getConfig, queryList } from "../query.js";

/**
 * Query endpoint
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Next middleware callback
 * @returns {object} HTTP response
 */
export const queryController = async (request, response, next) => {
  const { application, publication } = request.app.locals;
  const config = getConfig(application, publication);
  const { query } = request;
  const { filter, limit, offset } = query;

  try {
    if (!query.q) {
      throw new httpError.BadRequest("Invalid query");
    }

    switch (query.q) {
      case "config": {
        return response.json(config);
      }

      case "category": {
        return response.json({
          categories: queryList(config.categories, { filter, limit, offset }),
        });
      }

      case "source": {
        // Return mf2 for a given source URL
        if (query.url) {
          const mf2 = await url2Mf2(query.url);

          if (mf2.items.length === 0) {
            return response.send("Source has no items");
          }

          const properties = getMf2Properties(mf2, query.properties);
          return response.json(properties);
        }

        // Return mf2 for previously published posts
        const items = publication.posts
          ? await publication.posts
              .find()
              .map((post) => jf2ToMf2(post.properties))
              .toArray()
          : [];
        return response.json({
          items: queryList(items, { filter, limit, offset }),
        });
      }

      default: {
        if (config[query.q]) {
          return response.json({
            [query.q]: queryList(config[query.q], { filter, limit, offset }),
          });
        }

        throw new httpError.NotImplemented(`Unsupported parameter: ${query.q}`);
      }
    }
  } catch (error) {
    next(httpError(error));
  }
};
