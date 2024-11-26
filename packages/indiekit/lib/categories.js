import { getCachedResponse } from "./cache.js";

/**
 * Return array of available categories. If not a simple array, fetch array
 * from remote JSON file specified in `url` value.
 * @param {object} Indiekit - Indiekit instance
 * @returns {Promise<Array>} Array of categories
 */
export const getCategories = async (Indiekit) => {
  const { cache, config, publication } = Indiekit;
  const { categories } = publication;

  let categoryList = [];

  if (categories && categories.constructor === Array) {
    categoryList = categories;
  }

  if (categories && URL.canParse(categories)) {
    categoryList = await getCachedResponse(
      cache,
      config.application.ttl,
      categories,
    );
  }

  if (categoryList) {
    return categoryList.sort();
  }

  return [];
};
