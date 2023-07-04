import { isUrl } from "@indiekit/util";
import { getCachedResponse } from "./cache.js";

/**
 * Return array of available categories. If not a simple array, fetch array
 * from remote JSON file specified in `url` value.
 * @param {object} cache - Application cache
 * @param {object} publication - Publication configuration
 * @returns {Promise<Array>} Array of categories
 */
export const getCategories = async (cache, publication) => {
  const { categories } = publication;

  if (categories && categories.constructor === Array) {
    return categories.sort();
  }

  if (categories && isUrl(categories)) {
    const cachedCategories = await getCachedResponse(cache, categories);
    return cachedCategories.sort();
  }

  return [];
};
