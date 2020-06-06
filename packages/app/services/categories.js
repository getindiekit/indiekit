import {Cache} from './cache.js';

/**
 * Return array of available categories. If not a simple array,
 * fetch array from remote JSON file specified in `url` value.
 *
 * @param {object} client Redis client
 * @param {object} pubCategories Publication category configuration
 * @returns {Promise|Array} Array of categories
 */
export const getCategories = async (client, pubCategories) => {
  let categories = [];

  if (pubCategories && pubCategories.url) {
    const cache = new Cache(client);
    const cachedCategories = await cache.json('categories', pubCategories.url);
    categories = cachedCategories.data;
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};
