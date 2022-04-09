import { getNavigation } from "../navigation.js";
import { getEndpoint } from "../publication.js";

/**
 * Expose config to frontend templates
 *
 * @param {object} indiekitConfig Indiekit config
 * @returns {Function} Next middleware
 */
export const locals = (indiekitConfig) =>
  async function (request, response, next) {
    try {
      const { application, publication } = indiekitConfig;

      // Application
      application.localeUsed = request.getLocale();
      application.navigation = getNavigation(application, request, response);
      application.url =
        application.url || `${request.protocol}://${request.headers.host}`;
      response.locals.application = application;

      // Publication
      publication.mediaEndpoint = getEndpoint("mediaEndpoint", indiekitConfig);
      publication.micropubEndpoint = getEndpoint(
        "micropubEndpoint",
        indiekitConfig
      );
      publication.tokenEndpoint = getEndpoint("tokenEndpoint", indiekitConfig);
      response.locals.publication = publication;

      // Session
      response.locals.session = request.session;

      next();
    } catch (error) {
      next(error);
    }
  };
