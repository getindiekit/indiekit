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
} from './properties.js';

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
  const {posts} = publication;

  try {
    return posts.get(url);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Update post data
 *
 * @param {string} url URL of existing post
 * @param {object} publication Publication configuration
 * @param {object} update Requested updates
 * @returns {object} Post data
 */
export const updatePostData = async (url, publication, update) => {
  const {config, me, posts} = publication;

  try {
    const postData = await posts.get(url);

    // Post type
    const {type} = postData;
    const typeConfig = getPostTypeConfig(type, config);

    // Post properties
    let {properties} = postData.mf2;

    // Replace property entries
    if (update.replace) {
      properties = replaceEntries(properties, update.replace);
    }

    // Add properties
    if (update.add) {
      properties = addProperties(properties, update.add);
    }

    // Remove properties and/or property entries
    if (update.delete) {
      if (Array.isArray(update.delete)) {
        properties = deleteProperties(properties, update.delete);
      } else {
        properties = deleteEntries(properties, update.delete);
      }
    }

    // Post paths
    const path = templates.renderString(typeConfig.post.path, properties);
    let updatedUrl = templates.renderString(typeConfig.post.url, properties);
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
  } catch (error) {
    throw new Error(error.message);
  }
};
