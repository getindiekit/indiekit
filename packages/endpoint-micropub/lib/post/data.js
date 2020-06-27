import {templates} from '../nunjucks.js';
import getPostType from 'post-type-discovery';
import {
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries,
  getPostTypeConfig
} from '../utils.js';
import {
  getContent,
  getPermalink,
  getPublishedDate,
  getSlug
} from '../microformats/properties.js';

/**
 * Create post data
 *
 * @param {object} mf2 Microformats 2
 * @param {object} publication Publication configuration
 * @returns {object} Post data
 */
export const createPostData = (mf2, publication) => {
  const {config, locale, me, timezone} = publication;

  try {
    // Post type
    const type = getPostType(mf2);
    const typeConfig = getPostTypeConfig(type, config);

    // Post properties
    const {properties} = mf2;
    properties.content = getContent(mf2);
    properties.published = getPublishedDate(mf2, locale, timezone);
    properties.slug = getSlug(mf2, config['slug-separator']);

    // Post paths
    const path = templates.renderString(typeConfig.post.path, properties);
    let url = templates.renderString(typeConfig.post.url, properties);
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
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Read post data
 *
 * @param {string} url URL of existing post
 * @param {object} publication Publication configuration
 * @returns {object} Post data
 */
export const readPostData = async (url, publication) => {
  try {
    return publication.posts.get(url);
  } catch (error) {
    console.warn(error);
  }
};

/**
 * Update post data
 *
 * @param {string} url URL of existing post
 * @param {object} publication Publication configuration
 * @param {object} operation Request
 * @returns {object} Post data
 */
export const updatePostData = async (url, publication, operation) => {
  const {config, me} = publication;

  try {
    const postData = await this.readPostData(url);

    // Post type
    const {type} = postData;
    const typeConfig = getPostTypeConfig(type, config);

    // Post properties
    let {properties} = postData.mf2;

    // Replace property entries
    if (operation.replace) {
      properties = replaceEntries(properties, operation.replace);
    }

    // Add properties
    if (operation.add) {
      properties = addProperties(properties, operation.add);
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
    const path = templates.renderString(typeConfig.post.path, properties);
    let url = templates.renderString(typeConfig.post.url, properties);
    url = getPermalink(me, url);

    // Add computed URL to post properties
    properties.url = [url];

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
  } catch (error) {
    throw new Error(error.message);
  }
};
