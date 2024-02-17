import { getCachedResponse } from "./cache.js";

/**
 * Return array of available categories. If not a simple array, fetch array
 * from remote JSON file specified in `url` value.
 * @param {object} Indiekit - Indiekit instance
 * @returns {Promise<Array>} Array of categories
 */
export const getCategories = async (Indiekit) => {
  const { application, publication } = Indiekit;
  const { categories } = publication;

  if (categories && categories.constructor === Array) {
    return categories.sort();
  }

  if (categories && URL.canParse(categories)) {
    const cachedCategories = await getCachedResponse(
      application.cache,
      application.ttl,
      categories,
    );
    return cachedCategories.sort();
  }

  return [];
};
