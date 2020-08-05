import getPostType from 'post-type-discovery';
import HttpError from 'http-errors';
import {mf2tojf2} from '@paulrobertlloyd/mf2tojf2';
import * as update from './update.js';
import {
  renderPath,
  getPermalink,
  getPostTypeConfig
} from './utils.js';

export const postData = {
  /**
   * Create post data
   *
   * @param {object} publication Publication configuration
   * @param {object} mf2 microformats2
   * @returns {object} Post data
   */
  create: async (publication, mf2) => {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!mf2) {
        throw new Error('No microformats included in request');
      }

      const {config, me} = publication;

      // Serialize post as JF2
      const jf2 = mf2tojf2({items: [mf2]});
      jf2['post-type'] = getPostType(mf2);

      // Post paths
      const typeConfig = getPostTypeConfig(jf2['post-type'], config);
      const path = renderPath(typeConfig.post.path, jf2);
      const url = renderPath(typeConfig.post.url, jf2);
      jf2.url = getPermalink(me, url);

      // Post data
      const postData = {path, url: jf2.url, jf2};
      return postData;
    } catch (error) {
      throw new HttpError(400, error.message, {
        value: 'invalid_request'
      });
    }
  },

  /**
   * Read post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @returns {object} Post data
   */
  read: async (publication, url) => {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!url) {
        throw new Error('No URL provided');
      }

      const {posts} = publication;
      return posts.get(url);
    } catch (error) {
      throw new HttpError(400, error.message, {
        value: 'invalid_request'
      });
    }
  },

  /**
   * Update post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @param {object} operation Requested operation
   * @returns {object} Post data
   */
  update: async (publication, url, operation) => {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!url) {
        throw new Error('No URL provided');
      }

      if (!url) {
        throw new Error('No update operation provided');
      }

      const {config, me, posts} = publication;
      let {jf2} = await posts.get(url);

      // Add properties
      if (operation.add) {
        jf2 = update.addProperties(jf2, operation.add);
      }

      // Replace property entries
      if (operation.replace) {
        jf2 = update.replaceEntries(jf2, operation.replace);
      }

      // Remove properties and/or property entries
      if (operation.delete) {
        if (Array.isArray(operation.delete)) {
          jf2 = update.deleteProperties(jf2, operation.delete);
        } else {
          jf2 = update.deleteEntries(jf2, operation.delete);
        }
      }

      // Post paths
      const typeConfig = getPostTypeConfig(jf2['post-type'], config);
      const path = renderPath(typeConfig.post.path, jf2);
      const updatedUrl = renderPath(typeConfig.post.url, jf2);
      jf2.url = getPermalink(me, updatedUrl);

      // Return post data
      const updatedPostData = {path, url: jf2.url, jf2};
      return updatedPostData;
    } catch (error) {
      throw new HttpError(400, error.message, {
        value: 'invalid_request'
      });
    }
  }
};
