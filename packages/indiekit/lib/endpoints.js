import { getUrl } from "./utils.js";

/**
 * Get provided endpoint URL, else add path to application URL
 * @param {object} application - Application configuration
 * @param {import("express").Request} request - Request
 * @returns {object} Endpoint URLs
 */
export const getEndpointUrls = (application, request) => {
  const endpoints = {};

  // @todo Provide a method for plug-ins to register named endpoints
  for (const endpoint of [
    "authorizationEndpoint",
    "introspectionEndpoint",
    "mediaEndpoint",
    "micropubEndpoint",
    "microsubEndpoint",
    "tokenEndpoint",
    "shareEndpoint",
    "userinfoEndpoint",
  ]) {
    endpoints[endpoint] = URL.canParse(application[endpoint])
      ? application[endpoint]
      : new URL(application[endpoint], getUrl(request)).href;
  }

  return endpoints;
};
