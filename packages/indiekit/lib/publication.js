import { isUrl, getUrl } from "./utils.js";

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
