import HttpError from 'http-errors';
import {
  getPermalink,
  getPostTypeConfig,
  renderPath
} from './utils.js';
import {
  getFileProperties,
  getMediaType
} from './file.js';

export const mediaData = {
  /**
   * Create media data
   *
   * @param {object} publication Publication configuration
   * @param {object} file File
   * @returns {object} Media data
   */
  create: async (publication, file) => {
    const {config, me} = publication;

    if (!file || file.truncated || !file.buffer) {
      throw new HttpError(400, 'No file included in request', {
        value: 'invalid_request'
      });
    }

    // Media type
    const type = await getMediaType(file);
    const typeConfig = getPostTypeConfig(type, config);

    // Media properties
    const properties = await getFileProperties(file);

    // Media paths
    const path = renderPath(typeConfig.media.path, properties);
    let url = renderPath(typeConfig.media.url || typeConfig.media.path, properties);
    url = getPermalink(me, url);

    // Media data
    const mediaData = {type, path, url, properties};
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
