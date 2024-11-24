import { getUrl } from "./utils.js";

/**
 * Get provided endpoint URL, else add path to application URL
 * @param {object} application - Application configuration
 * @param {import("express").Request} request - Request
 * @returns {object} Endpoint URLs
 */
export const getEndpointUrls = (application, request) => {
  const endpoints = {};

  for (const endpoint of [
    "authorizationEndpoint",
    "introspectionEndpoint",
    "mediaEndpoint",
    "micropubEndpoint",
    "tokenEndpoint",
  ]) {
    endpoints[endpoint] =
      application[endpoint] && URL.canParse(application[endpoint])
        ? application[endpoint]
        : new URL(application[endpoint], getUrl(request)).href;
  }

  return endpoints;
};
