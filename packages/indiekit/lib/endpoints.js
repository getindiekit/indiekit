import { isUrl } from "@indiekit/util";
import { getUrl } from "./utils.js";

/**
 * Get endpoint URLs from application configuration or default plug-ins
 * @param {object} application - Application configuration
 * @param {import("express").Request} request - Request
 * @returns {object} Endpoint URLs
 */
export const getEndpoints = (application, request) => {
  const endpoints = {};

  for (const endpoint of [
    "authorizationEndpoint",
    "introspectionEndpoint",
    "mediaEndpoint",
    "micropubEndpoint",
    "tokenEndpoint",
  ]) {
    endpoints[endpoint] =
      application[endpoint] && isUrl(application[endpoint])
        ? // Use endpoint URL in application config
          application[endpoint]
        : // Else, use private path value provided by default endpoint plug-in
          // to construct a fully resolvable URL mounted on application URL
          (endpoints[endpoint] = new URL(
            application[`_${endpoint}Path`],
            getUrl(request)
          ).href);
  }

  return endpoints;
};
