import fileCacheService from './file-cache.js';

/**
 * @exports customConfigService
 * @param {String} url URL of custom configuration
 * @returns {Promise|Object} Custom configuration object
 */
export default async url => {
  let config = {};

  if (url) {
    const cachedConfig = await fileCacheService('customConfig', url);
    config = cachedConfig.data;
  }

  return config;
};
