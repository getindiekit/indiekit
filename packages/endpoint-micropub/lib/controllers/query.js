import { IndiekitError } from "@indiekit/error";
import { getCursor } from "@indiekit/util";
import { getConfig, queryConfig } from "../config.js";
import { getMf2Properties, jf2ToMf2 } from "../mf2.js";

/**
 * Query published posts
 * @type {import("express").RequestHandler}
 */
export const queryController = async (request, response, next) => {
  const { application, publication } = request.app.locals;

  try {
    const config = getConfig(application, publication);
    const limit = Number(request.query.limit) || 0;
    const offset = Number(request.query.offset) || 0;
    let { after, before, filter, properties, q, url } = request.query;

    if (!q) {
      throw IndiekitError.badRequest(
        response.locals.__("BadRequestError.missingParameter", "q")
      );
    }

    // `category` param is used to query `categories` configuration property
    q = q === "category" ? "categories" : String(q);

    switch (q) {
      case "config": {
        response.json(config);

        break;
      }

      case "source": {
        if (url) {
          // Return mf2 for a given URL (optionally filtered by properties)
          let item;

          if (application.hasDatabase) {
            item = await application.posts.findOne({
              "properties.url": url,
            });
          }

          if (!item) {
            throw IndiekitError.badRequest(
              response.locals.__("BadRequestError.missingResource", "post")
            );
          }

          const mf2 = jf2ToMf2(item.properties);
          response.json(getMf2Properties(mf2, properties));
        } else {
          // Return mf2 for  published posts
          let cursor = {
            items: [],
            hasNext: false,
            hasPrev: false,
          };

          if (application.hasDatabase) {
            cursor = await getCursor(application.posts, after, before, limit);
          }

          response.json({
            items: cursor.items.map((post) => jf2ToMf2(post.properties)),
            paging: {
              ...(cursor.hasNext && { after: cursor.lastItem }),
              ...(cursor.hasPrev && { before: cursor.firstItem }),
            },
          });
        }

        break;
      }

      default: {
        // Query configuration value (can be filtered, limited and offset)
        if (config[q]) {
          response.json({
            [q]: queryConfig(config[q], { filter, limit, offset }),
          });
        } else {
          throw IndiekitError.notImplemented(
            response.locals.__("NotImplementedError.query", {
              key: "q",
              value: q,
            })
          );
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
