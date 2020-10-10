import Debug from 'debug';
import mongodb from 'mongodb';
import {capitalize} from '../lib/utils.js';

const debug = new Debug('indiekit:error');
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
            text: typeof value === 'string' ? value : JSON.stringify(value)
          }
        })
      );

      response.render('post', {
        parent: response.__('micropub.posts.title'),
        title: post.properties.name || capitalize(post.properties['post-type']),
        content: post.properties.content,
        properties,
        post
      });
    } catch (error) {
      debug(error.stack);
      next(error);
    }
  }
});
