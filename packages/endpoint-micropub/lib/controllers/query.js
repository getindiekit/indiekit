import { IndiekitError } from "@indiekit/error";
import { getConfig, queryConfig } from "../config.js";
import { getMf2Properties, jf2ToMf2 } from "../mf2.js";

/**
 * Query previously published posts
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

    const config = getConfig(application, publication);

    let { page, limit, offset } = request.query;
    page = Number.parseInt(page, 10) || 1;
    limit = Number.parseInt(limit, 10) || 40;
    offset = Number.parseInt(offset, 10) || (page - 1) * limit;

    const posts = await publication.posts
      .find()
      .sort({ "properties.published": -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    let { filter, properties, q, url } = request.query;
    if (!q) {
      throw IndiekitError.badRequest(
        response.__("BadRequestError.missingParameter", "q")
      );
    }

    let item;
    if (url) {
      item = await publication.posts.findOne({ "properties.url": url });

      if (!item) {
        throw IndiekitError.notFound(
          response.__("NotFoundError.resource", "post")
        );
      }
    }

    // `category` param is used to query `categories` configuration property
    q = q === "category" ? "categories" : q;

    switch (q) {
      case "config": {
        return response.json(config);
      }

      case "source": {
        // Return mf2 for a given source URL (optionally filtered by properties)
        if (url) {
          const mf2 = { items: [jf2ToMf2(item.properties)] };
          return response.json(getMf2Properties(mf2, properties));
        }

        // Return mf2 for previously published posts
        return response.json({
          _count: await publication.posts.countDocuments(),
          items: posts.map((post) => jf2ToMf2(post.properties)),
        });
      }

      default: {
        // Query configuration value (can be filtered, limited and offset)
        if (config[q]) {
          return response.json({
            [q]: queryConfig(config[q], { filter, limit, offset }),
          });
        }

        throw IndiekitError.notImplemented(
          response.__("NotImplementedError.query", { key: "q", value: q })
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
