import fileCacheService from './file-cache.js';

/**
 * @param {string} url URL of custom configuration
 * @returns {Promise|object} Custom configuration object
 */
export default async url => {
  let config = {};

  if (url) {
    try {
      const cachedConfig = await fileCacheService('customConfig', url);
      config = cachedConfig.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return config;
};
