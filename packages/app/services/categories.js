import CacheService from './cache.js';

/**
 * Fetch publication categories. If not a simple array, fetch remotely
 * hosted JSON file and cache for reuse
 *
 * @param {object} client Redis client
 * @param {object} pubCategories Publication category configuration
 * @returns {Promise|Array} Array of categories
 */
export default async (client, pubCategories) => {
  let categories = [];

  if (pubCategories && pubCategories.url) {
    const cache = new CacheService(client);
    const cachedCategories = await cache.json('categories', pubCategories.url);
    categories = cachedCategories.data;
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};
