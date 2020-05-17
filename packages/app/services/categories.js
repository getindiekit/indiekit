import fileCacheService from './file-cache.js';

/**
 * @exports categoriesService
 * @param {Object} pubCategories Publication category configuration
 * @returns {Promise|Array} Array of categories
 */
export default async pubCategories => {
  let categories = [];

  if (pubCategories && pubCategories.url) {
    const cachedCategories = await fileCacheService('categories', pubCategories.url);
    categories = cachedCategories.data;
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};
