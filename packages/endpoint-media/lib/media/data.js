import {templates} from '../nunjucks.js';
import {
  getPostTypeConfig
} from '../utils.js';
import {
  getFileProperties,
  getMediaType,
  getPermalink
} from './properties.js';

export const mediaData = {
  /**
   * Create media data
   *
   * @param {object} publication Publication configuration
   * @param {object} file File
   * @returns {object} Media data
   */
  create: async (publication, file) => {
    const {config, locale, me, timezone} = publication;

    if (!file || file.truncated || !file.buffer) {
      throw new Error('No file included in request');
    }

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
  },

  /**
   * Read media data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of uploaded media
   * @returns {object} Media data
   */
  read: async (publication, url) => {
    const {media} = publication;
    return media.get(url);
  }
};
