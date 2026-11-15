import { getCachedResponse } from "./cache.js";

/**
 * Return array of available categories. If not a simple array, fetch array
 * from remote JSON file specified in `url` value.
 * @param {IndiekitInstance} Indiekit - Indiekit instance
 * @returns {Promise<string[]>} Array of categories
 */
export const getCategories = async (Indiekit) => {
  const { cache, config } = Indiekit;
  const { categories } = config.publication;

  /**
   * @type {string[]|undefined}
   */
  let categoryList = [];

  if (Array.isArray(categories)) {
    categoryList = categories;
  }

  if (typeof categories === "string" && URL.canParse(categories)) {
    categoryList = /** @type {string[]|undefined} */ (
      await getCachedResponse(cache, config.application.ttl, categories)
    );
  }

  if (categoryList) {
    return categoryList.toSorted((a, b) => a.localeCompare(b));
  }

  return [];
};
