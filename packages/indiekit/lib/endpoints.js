import { isUrl, getUrl } from "./utils.js";

/**
 * Get endpoint URLs from application configuration or default plug-ins
 *
 * @param {object} application - Application configuration
 * @param {object} request - HTTP request
 * @returns {object} Endpoint URLs
 */
export const getEndpoints = (application, request) => {
  const endpoints = {};

  for (const endpoint of [
    "authorizationEndpoint",
    "mediaEndpoint",
    "micropubEndpoint",
    "tokenEndpoint",
  ]) {
    // Use endpoint URL in application config
    if (application[endpoint] && isUrl(application[endpoint])) {
      endpoints[endpoint] = application[endpoint];
    } else {
      // Else, use private path value provided by default endpoint plug-in
      // to construct a fully resolvable URL mounted on application URL
      endpoints[endpoint] = new URL(
        application[`_${endpoint}Path`],
        getUrl(request)
      ).href;
    }
  }

  return endpoints;
};
