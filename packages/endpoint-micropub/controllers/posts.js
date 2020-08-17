import mongodb from 'mongodb';

const {ObjectId} = mongodb;

export const postsController = publication => ({
  /**
   * Return previously published posts
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  list: async (request, response, next) => {
    try {
      response.render('posts', {
        title: 'Published posts',
        posts: await publication.posts.find().toArray(),
        parentUrl: `${publication.micropubEndpoint}/posts/`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Return previously published posts
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

      const properties = [];
      Object.entries(post.properties).forEach(
        ([key, value]) => properties.push({
          key: {
            text: key
          },
          value: {
            text: value
          }
        })
      );

      response.render('post', {
        parent: 'Published posts',
        title: post.properties.name,
        content: post.properties.content,
        published: post.properties.published,
        url: post.url,
        properties
      });
    } catch (error) {
      next(error);
    }
  }
});
