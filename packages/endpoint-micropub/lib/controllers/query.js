import httpError from "http-errors";
import { getConfig, queryConfig } from "../config.js";
import { getMf2Properties, jf2ToMf2 } from "../mf2.js";

/**
 * Query previously published posts
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

    const config = getConfig(application, publication);

    let { page, limit, offset } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 40;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const posts = await publication.posts
      .find()
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    let { filter, properties, q, url } = request.query;
    if (!q) {
      throw new httpError.BadRequest("Invalid query");
    }

    let item;
    if (url) {
      item = await publication.posts.findOne({ "properties.url": url });

      if (!item) {
        throw new httpError.NotFound("No post was found at this URL");
      }
    }

    // `category` param is used to query `categories` configuration property
    q = q === "category" ? "categories" : q;

    switch (q) {
      case "config":
        return response.json(config);

      case "source":
        // Return mf2 for a given source URL (optionally filtered by properties)
        if (url) {
          const mf2 = { items: [jf2ToMf2(item.properties)] };
          return response.json(getMf2Properties(mf2, properties));
        }

        // Return mf2 for previously published posts
        return response.json({
          items: posts.map((post) => jf2ToMf2(post.properties)),
        });

      default:
        // Query configuration value (can be filtered, limited and offset)
        if (config[q]) {
          return response.json({
            [q]: queryConfig(config[q], { filter, limit, offset }),
          });
        }

        throw new httpError.NotImplemented(`Unsupported parameter: ${q}`);
    }
  } catch (error) {
    next(error);
  }
};
