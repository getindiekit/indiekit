import { IndiekitError } from "@indiekit/error";
import { getCursor } from "@indiekit/util";

import { getConfig, queryConfig } from "../config.js";
import { getMf2Properties, jf2ToMf2 } from "../mf2.js";

/**
 * @typedef {object} QueryParameters
 * @property {string} [after] - Return items after this item ID
 * @property {string} [before] - Return items before this item ID
 * @property {string} [filter] - Value to filter items by
 * @property {string} [limit] - Number of items to return
 * @property {string} [offset] - Offset to start limit of items
 * @property {string|string[]} [properties] - mf2 properties to select
 * @property {string} [q] - Query
 * @property {string} [url] - URL of post to return
 */

/**
 * Query published posts
 * @type {import("express").RequestHandler<Record<string, string>, unknown, unknown, QueryParameters>}
 */
export const queryController = async (request, response, next) => {
  const { application, publication } = request.app.locals;
  const postsCollection = application?.collections?.get("posts");

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

    // `channel` param is used to query `channels` configuration property
    q = q === "channel" ? "channels" : String(q);

    switch (q) {
      case "config": {
        response.json(config);

        break;
      }

      case "source": {
        if (url) {
          // Return mf2 for a given URL (optionally filtered by properties)
          let postData;

          if (postsCollection) {
            postData = await postsCollection.findOne({
              "properties.url": url,
            });
          }

          if (!postData) {
            throw IndiekitError.badRequest(
              response.locals.__("BadRequestError.missingResource", "post"),
            );
          }

          const mf2 = jf2ToMf2(postData);
          return response.json(getMf2Properties(mf2, properties));
        }
        // Return mf2 for published posts
        let cursor = {
          items: [],
          hasNext: false,
          hasPrev: false,
        };

        if (postsCollection) {
          cursor = await getCursor(postsCollection, after, before, limit);
        }

        const items = [];
        for (let item of cursor.items) {
          if (item.properties) {
            items.push(jf2ToMf2(item));
          } else {
            /**
             * @todo Consider better way to handle item with no properties
             * - notify user and remove item from database?
             * - notify user and don’t delete item from database?
             * - fail silently?
             */
            console.warn(`Item ignored because it has no properties`, item);
          }
        }

        return response.json({
          items,
          paging: {
            ...(cursor.hasNext && { after: cursor.lastItem }),
            ...(cursor.hasPrev && { before: cursor.firstItem }),
          },
        });
      }

      default: {
        // Query configuration value (can be filtered, limited and offset)
        if (Object.hasOwn(config, q)) {
          return response.json({
            [q]: queryConfig(config[q], { filter, limit, offset }),
          });
        }

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
