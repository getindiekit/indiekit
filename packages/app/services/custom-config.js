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
      let {message} = error;
      if (error.name === 'TypeError') {
        message = 'Enter a valid URL';
      } else if (error.name === 'RequestError') {
        message = 'Custom configuration URL should be publicly accessible';
      } else if (error.name === 'ParseError') {
        message = 'Custom configuration file should use the JSON format';
      }

      throw new Error(message);
    }
  }

  return config;
};
