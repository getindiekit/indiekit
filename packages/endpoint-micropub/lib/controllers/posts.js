import httpError from "http-errors";
import mongodb from "mongodb";
import { getConfig, queryConfig } from "../config.js";
import { getMf2Properties, jf2ToMf2, url2Mf2 } from "../mf2.js";

export const postsController = {
  /**
   * List previously published posts
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  async posts(request, response, next) {
    try {
      const { application, publication } = request.app.locals;

      if (!application.hasDatabase) {
        throw new httpError.NotImplemented(
          response.__("errors.noDatabase.content")
        );
      }

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

      if (request.accepts("html")) {
        response.render("posts", {
          title: response.__("micropub.posts.title"),
          posts,
          page,
          limit,
          count: await publication.posts.countDocuments(),
          parentUrl: request.baseUrl + request.path,
        });
      } else {
        let { filter, properties, q, url } = request.query;
        const config = getConfig(application, publication);
        const items = posts.map((post) => jf2ToMf2(post.properties));

        if (!q) {
          throw new httpError.BadRequest("Invalid query");
        }

        // `category` param is used to query `categories` configuration property
        q = q === "category" ? "categories" : q;

        switch (q) {
          case "config":
            return response.json(config);

          case "source":
            // Return mf2 for a given source URL
            if (url) {
              const mf2 = await url2Mf2(url);
              return response.json(getMf2Properties(mf2, properties));
            }

            // Return mf2 for previously published posts
            return response.json({ items });

          default:
            // Query configuration value (can be filtered, limited and offset)
            if (config[q]) {
              return response.json({
                [q]: queryConfig(config[q], { filter, limit, offset }),
              });
            }

            throw new httpError.NotImplemented(`Unsupported parameter: ${q}`);
        }
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * View previously published post
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async post(request, response, next) {
    try {
      const { publication } = request.app.locals;
      const { id } = request.params;
      const post = await publication.posts.findOne({
        _id: new mongodb.ObjectId(id),
      });

      if (!post) {
        throw new httpError.NotFound("No post was found with this UUID");
      }

      response.render("post", {
        parent: response.__("micropub.posts.title"),
        post,
      });
    } catch (error) {
      next(error);
    }
  },
};
