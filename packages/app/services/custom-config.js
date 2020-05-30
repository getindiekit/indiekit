import CacheService from './cache.js';

/**
 * Fetch custom configuration file and cache for reuse
 *
 * @param {object} client Redis client
 * @param {string} url URL of custom configuration
 * @returns {Promise|object} Custom configuration object
 */
export default async (client, url) => {
  let config = {};

  if (url) {
    try {
      const cache = new CacheService(client);
      const cachedConfig = await cache.json('customConfig', url);
      config = cachedConfig.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return config;
};
