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
  async create(publication, mf2) {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!mf2) {
        throw new Error('No microformats included in request');
      }

      const {me, postTypes, timeZone} = publication;

      // Post properties
      const properties = mf2tojf2({items: [mf2]});

      // Post type
      const type = getPostType(mf2);
      const typeConfig = getPostTypeConfig(type, postTypes);
      properties['post-type'] = type;

      // Post paths
      const path = renderPath(typeConfig.post.path, properties, timeZone);
      const url = renderPath(typeConfig.post.url, properties, timeZone);
      properties.url = getPermalink(me, url);

      // Post data
      const postData = {path, properties, mf2};
      return postData;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },

  /**
   * Read post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @returns {object} Post data
   */
  async read(publication, url) {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!url) {
        throw new Error('No URL provided');
      }

      const {posts} = publication;
      const post = await posts.findOne({
        'properties.url': url
      });
      return post;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },

  /**
   * Update post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @param {object} operation Requested operation(s)
   * @returns {object} Post data
   */
  async update(publication, url, operation) {
    try {
      if (!publication) {
        throw new Error('No publication configuration provided');
      }

      if (!url) {
        throw new Error('No URL provided');
      }

      if (!operation) {
        throw new Error('No update operation provided');
      }

      const {me, posts, postTypes, timeZone} = publication;

      const post = await posts.findOne({
        'properties.url': url
      });

      if (!post) {
        throw new Error(`No post record available for ${url}`);
      }

      const {mf2} = post;

      // Add properties
      if (operation.add) {
        mf2.properties = update.addProperties(mf2.properties, operation.add);
      }

      // Replace property entries
      if (operation.replace) {
        mf2.properties = update.replaceEntries(mf2.properties, operation.replace);
      }

      // Remove properties and/or property entries
      if (operation.delete) {
        if (Array.isArray(operation.delete)) {
          mf2.properties = update.deleteProperties(mf2.properties, operation.delete);
        } else {
          mf2.properties = update.deleteEntries(mf2.properties, operation.delete);
        }
      }

      // Post type
      const type = getPostType(mf2);
      const typeConfig = getPostTypeConfig(type, postTypes);

      // Post properties
      const properties = mf2tojf2({items: [mf2]});
      properties['post-type'] = type;

      // Post paths
      const path = renderPath(typeConfig.post.path, properties, timeZone);
      const updatedUrl = renderPath(typeConfig.post.url, properties, timeZone);
      properties.url = getPermalink(me, updatedUrl);

      // Return post data
      const updatedPostData = {path, properties, mf2};
      return updatedPostData;
    } catch (error) {
      throw new HttpError(400, error);
    }
  }
};
