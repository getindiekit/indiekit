import getPostType from 'post-type-discovery';
import {
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries,
  renderPath,
  getPostTypeConfig
} from '../utils.js';
import {
  getContent,
  getPermalink,
  getPublishedDate,
  getSlug
} from './properties.js';

export const postData = {
  /**
   * Create post data
   *
   * @param {object} publication Publication configuration
   * @param {object} mf2 Microformats 2
   * @returns {object} Post data
   */
  create: async (publication, mf2) => {
    const {config, me} = publication;

    if (!mf2) {
      throw new Error('Unable to create post without microformats data');
    }

    // Post type
    const type = getPostType(mf2);
    const typeConfig = getPostTypeConfig(type, config);

    // Post properties
    const {properties} = mf2;
    properties.content = getContent(mf2);
    properties.published = getPublishedDate(mf2);
    properties.slug = getSlug(mf2, config['slug-separator']);

    // Post paths
    const path = renderPath(typeConfig.post.path, properties);
    let url = renderPath(typeConfig.post.url, properties);
    url = getPermalink(me, url);

    // Add computed URL to post properties
    properties.url = [url];

    // Post data
    const postData = {
      type,
      path,
      url,
      mf2: {
        type: (type === 'event') ? ['h-event'] : ['h-entry'],
        properties
      }
    };

    return postData;
  },

  /**
   * Read post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @returns {object} Post data
   */
  read: async (publication, url) => {
    const {posts} = publication;
    return posts.get(url);
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
    const {config, me, posts} = publication;
    const postData = await posts.get(url);

    // Post type
    const {type} = postData;
    const typeConfig = getPostTypeConfig(type, config);

    // Post properties
    let {properties} = postData.mf2;

    // Add properties
    if (operation.add) {
      properties = addProperties(properties, operation.add);
    }

    // Replace property entries
    if (operation.replace) {
      properties = replaceEntries(properties, operation.replace);
    }

    // Remove properties and/or property entries
    if (operation.delete) {
      if (Array.isArray(operation.delete)) {
        properties = deleteProperties(properties, operation.delete);
      } else {
        properties = deleteEntries(properties, operation.delete);
      }
    }

    // Post paths
    const path = renderPath(typeConfig.post.path, properties);
    let updatedUrl = renderPath(typeConfig.post.url, properties);
    updatedUrl = getPermalink(me, updatedUrl);

    // Add computed URL to post properties
    properties.url = [updatedUrl];

    // Return post data
    const updatedPostData = {
      type,
      path,
      url,
      mf2: {
        type: (type === 'event') ? ['h-event'] : ['h-entry'],
        properties
      }
    };

    return updatedPostData;
  }
};
