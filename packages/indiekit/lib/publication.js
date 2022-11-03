import _ from "lodash";
import { getCachedResponse } from "./cache.js";
import { isUrl, getUrl } from "./utils.js";

/**
 * Return array of available categories. If not a simple array,
 * fetch array from remote JSON file specified in `url` value.
 *
 * @param {object} cache - Application cache
 * @param {object} publication - Publication configuration
 * @returns {Promise|Array} Array of categories
 */
export const getCategories = async (cache, publication) => {
  const { categories } = publication;

  if (categories && categories.constructor === Array) {
    return categories;
  }

  if (categories && isUrl(categories)) {
    const cachedCategories = await getCachedResponse(cache, categories);
    return cachedCategories;
  }

  return [];
};

/**
 * Get endpoint URLs from publication configuration or server derived value
 *
 * @param {object} indiekitConfig - Indiekit configuration
 * @param {object} request - HTTP request
 * @returns {object} Endpoint URLs
 */
export const getEndpoints = (indiekitConfig, request) => {
  const { application, publication } = indiekitConfig;
  const endpoints = {};

  for (const endpoint of [
    "authorizationEndpoint",
    "mediaEndpoint",
    "micropubEndpoint",
    "tokenEndpoint",
  ]) {
    // Use endpoint URL in publication config
    if (publication[endpoint] && isUrl(publication[endpoint])) {
      endpoints[endpoint] = publication[endpoint];
    } else {
      // Else, use endpoint path provided by application
      endpoints[endpoint] = new URL(
        application[endpoint],
        getUrl(request)
      ).href;
    }
  }

  return endpoints;
};

/**
 * Get post template
 *
 * @param {object} publication - Publication configuration
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
 * @param {object} publication - Publication configuration
 * @param {Array} publication.postTypes - Publication post types
 * @param {object} publication.preset - Publication preset
 * @returns {object} Merged configuration
 */
export const getPostTypes = ({ postTypes, preset }) => {
  if (preset?.postTypes && postTypes) {
    return _.values(
      _.merge(_.keyBy(preset.postTypes, "type"), _.keyBy(postTypes, "type"))
    );
  }

  if (preset?.postTypes) {
    return preset.postTypes;
  }

  return postTypes;
};
