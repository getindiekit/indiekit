import Debug from 'debug';
import mongodb from 'mongodb';

const debug = new Debug('indiekit:error');
const {ObjectId} = mongodb;

export const postsController = publication => ({
  /**
   * List previously published posts
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  list: async (request, response, next) => {
    try {
      response.render('posts', {
        title: response.__('micropub.posts.title'),
        posts: await publication.posts.find().toArray(),
        parentUrl: `${publication.micropubEndpoint}/posts/`
      });
    } catch (error) {
      debug(error);
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
  view: async (request, response, next) => {
    try {
      const {id} = request.params;
      const post = await publication.posts.findOne({_id: new ObjectId(id)});

      const summaryRows = [];
      Object.entries(post.properties).forEach(
        ([key, value]) => summaryRows.push({
          key: {
            text: key
          },
          value: {
            text: typeof value === 'string' ? value : JSON.stringify(value)
          }
        })
      );

      response.render('post', {
        parent: response.__('micropub.posts.title'),
        summaryRows,
        post
      });
    } catch (error) {
      debug(error.stack);
      next(error);
    }
  }
});
