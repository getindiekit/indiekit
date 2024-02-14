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
        response.locals.__("BadRequestError.missingParameter", "q"),
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
          let postData;

          if (application.hasDatabase) {
            postData = await application.posts.findOne({
              "properties.url": url,
            });
          }

          if (!postData) {
            throw IndiekitError.badRequest(
              response.locals.__("BadRequestError.missingResource", "post"),
            );
          }

          const mf2 = jf2ToMf2(postData);
          response.json(getMf2Properties(mf2, properties));
        } else {
          // Return mf2 for published posts
          let cursor = {
            items: [],
            hasNext: false,
            hasPrev: false,
          };

          if (application.hasDatabase) {
            cursor = await getCursor(application.posts, after, before, limit);
          }

          const items = [];
          for (let item of cursor.items) {
            if (item.properties) {
              items.push(jf2ToMf2(item));
            } else {
              // TODO: think about a proper way to handle this scenario:
              // - remove the item from MongoDB? Silently? After having notified the user?
              // - just notify the user and don't delete the item from MongoDB?
              // - do nothing?
              console.warn(`item discarded because it has no properties`, item);
            }
          }

          response.json({
            items,
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
            }),
          );
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
