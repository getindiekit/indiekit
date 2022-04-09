import _ from "lodash";
import { isUrl } from "./utils.js";

/**
 * Return array of available categories. If not a simple array,
 * fetch array from remote JSON file specified in `url` value.
 *
 * @param {object} cache Application cache
 * @param {object} publication Publication configuration
 * @returns {Promise|Array} Array of categories
 */
export const getCategories = async (cache, publication) => {
  const { categories } = publication;

  if (categories && categories.constructor === Array) {
    return categories;
  }

  if (categories && isUrl(categories)) {
    const cachedCategories = await cache.json("categories", categories);
    return cachedCategories.data;
  }

  return [];
};

/**
 * Get named endpoint from publication config or server derived value
 *
 * @param {string} endpointName Endpoint name
 * @param {string} applicationUrl Application URL
 * @returns {string} Endpoint URL
 */
export const getEndpoint = (endpointName, indiekitConfig) => {
  const { application, publication } = indiekitConfig;

  // Use endpoint in publication config
  if (publication[endpointName] && isUrl(publication[endpointName])) {
    return publication[endpointName];
  }

  // Else, use endpoint provided by application
  return new URL(application[endpointName], application.url).href;
};

/**
 * Get post template
 *
 * @param {object} publication Publication configuration
 * @returns {Function} Post template rendering function
 */
export const getPostTemplate = (publication) => {
  if (publication.postTemplate) {
    return publication.postTemplate;
  }

  if (publication.preset && publication.preset.postTemplate) {
    /*
     * Bind to publication.preset so that `this` in `postTemplate`
     * function can keep the context of its parent class
     */
    return publication.preset.postTemplate.bind(publication.preset);
  }

  return (properties) => JSON.stringify(properties);
};

/**
 * Get merged preset and custom post types
 *
 * @param {object} publication Publication configuration
 * @returns {object} Merged configuration
 */
export const getPostTypes = (publication) => {
  const hasPresetPostTypes = publication.preset && publication.preset.postTypes;
  const hasCustomPostTypes = publication.postTypes;

  if (hasPresetPostTypes && hasCustomPostTypes) {
    const mergedPostTypes = _.values(
      _.merge(
        _.keyBy(publication.preset.postTypes, "type"),
        _.keyBy(publication.postTypes, "type")
      )
    );

    return mergedPostTypes;
  }

  return [];
};
