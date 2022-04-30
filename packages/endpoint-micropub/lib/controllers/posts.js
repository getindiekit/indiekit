import HttpError from "http-errors";
import mongodb from "mongodb";

export const postsController = {
  /**
   * List previously published posts
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  async list(request, response, next) {
    try {
      const { application, publication } = request.app.locals;

      if (!application.hasDatabase) {
        throw new Error(response.__("errors.noDatabase.content"));
      }

      const page = Number.parseInt(request.query.page, 10) || 1;
      const limit = Number.parseInt(request.query.limit, 10) || 40;
      const skip = (page - 1) * limit;

      const posts = await publication.posts
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const count = await publication.posts.countDocuments();

      response.render("posts", {
        title: response.__("micropub.posts.title"),
        posts,
        page,
        limit,
        count,
        parentUrl: `${request.originalUrl}/`,
      });
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
  async view(request, response, next) {
    try {
      const { publication } = request.app.locals;
      const { id } = request.params;
      const post = await publication.posts.findOne({
        _id: new mongodb.ObjectId(id),
      });

      if (!post) {
        throw new HttpError(404, "No post was found with this UUID");
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
