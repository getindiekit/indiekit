import {templates} from '../nunjucks.js';
import {
  getPostTypeConfig
} from '../utils.js';
import {
  getFileProperties,
  getMediaType,
  getPermalink
} from './properties.js';

/**
 * Create media data
 *
 * @param {object} file Microformats 2
 * @param {object} publication Publication configuration
 * @returns {object} Post data
 */
export const createMediaData = async (file, publication) => {
  const {config, locale, me, timezone} = publication;

  if (!file || file.truncated || !file.buffer) {
    throw new Error('No file included in request');
  }

  try {
    // Media type
    const type = await getMediaType(file);
    const typeConfig = getPostTypeConfig(type, config);

    // Media properties
    const properties = await getFileProperties(file, locale, timezone);

    // Media paths
    const path = templates.renderString(typeConfig.media.path, properties);
    let url = templates.renderString(typeConfig.media.url || typeConfig.media.path, properties);
    url = getPermalink(me, url);

    // Media data
    const mediaData = {
      type,
      path,
      url,
      file: {
        properties
      }
    };

    return mediaData;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Read media data
 *
 * @param {string} url URL of uploaded media
 * @param {object} publication Publication configuration
 * @returns {object} Media data
 */
export const readMediaData = async (url, publication) => {
  const {media} = publication;

  try {
    return media.get(url);
  } catch (error) {
    throw new Error(error.message);
  }
};
