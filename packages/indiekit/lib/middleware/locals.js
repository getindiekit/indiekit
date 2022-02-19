import { getNavigation } from "../navigation.js";
import { getMediaEndpoint, getTokenEndpoint } from "../publication.js";

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
      publication.mediaEndpoint = getMediaEndpoint(
        publication.mediaEndpoint,
        request
      );
      publication.tokenEndpoint = getTokenEndpoint(
        publication.tokenEndpoint,
        request
      );
      response.locals.publication = publication;

      // Session
      response.locals.session = request.session;

      next();
    } catch (error) {
      next(error);
    }
  };
