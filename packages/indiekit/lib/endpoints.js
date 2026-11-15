import { getUrl } from "./utils.js";

/**
 * Get provided endpoint URL, else add path to application URL
 *
 * An endpoint with no URL, as its plug-in isn’t installed, is left out.
 * @param {Partial<IndiekitApplicationConfig>} application - Application configuration
 * @param {Request} request - Request
 * @returns {Partial<Record<EndpointName, string>>} Endpoint URLs
 */
export const getEndpointUrls = (application, request) => {
  /**
   * @type {Partial<Record<EndpointName, string>>}
   */
  const endpoints = {};

  /**
   * @todo Provide a method for plug-ins to register named endpoints
   * @type {EndpointName[]}
   */
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
 * @typedef {"authorizationEndpoint" | "introspectionEndpoint" | "mediaEndpoint"
 *   | "micropubEndpoint" | "microsubEndpoint" | "tokenEndpoint"
 *   | "shareEndpoint" | "userinfoEndpoint"} EndpointName
 */

/**
 * @import { Request } from "express"
 */
