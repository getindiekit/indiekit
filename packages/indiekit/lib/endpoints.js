import { getUrl } from "./utils.js";

/**
 * Get provided endpoint URL, else add path to application URL
 *
 * An endpoint with no URL, as its plug-in isn’t installed, is left out.
 * @param {object} application - Application configuration
 * @param {Request} request - Request
 * @returns {object} Endpoint URLs
 */
export const getEndpointUrls = (application, request) => {
  const endpoints = {};

  // @todo Provide a method for plug-ins to register named endpoints
  const endpointNames = [
    "authorizationEndpoint",
    "introspectionEndpoint",
    "mediaEndpoint",
    "micropubEndpoint",
    "microsubEndpoint",
    "tokenEndpoint",
    "shareEndpoint",
    "userinfoEndpoint",
  ];

  for (const endpoint of endpointNames) {
    const value = application[endpoint];

    if (!value) {
      continue;
    }

    endpoints[endpoint] = URL.canParse(value)
      ? value
      : new URL(value, getUrl(request)).href;
  }

  return endpoints;
};

/**
 * @import { Request } from "express"
 */
