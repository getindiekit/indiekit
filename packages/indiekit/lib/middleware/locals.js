import { getEndpoints } from "../endpoints.js";
import { getNavigation } from "../navigation.js";
import { getUrl } from "../utils.js";

/**
 * Expose configuration to frontend templates and plug-ins
 *
 * @param {object} indiekitConfig - Indiekit configuration
 * @returns {Function} Next middleware
 */
export const locals = (indiekitConfig) =>
  function (request, response, next) {
    try {
      const { application, publication } = indiekitConfig;

      // Application locale
      application.localeUsed = request.getLocale();

      // Application URL
      application.url = application.url || getUrl(request);

      // Application navigation
      // Only update if serving HTML to prevent wrong session link being shown
      if (request.accepts("html")) {
        application.navigation = getNavigation(application, request, response);
      }

      request.app.locals.application = application;

      // Publication
      request.app.locals.publication = {
        ...publication,
        ...getEndpoints(indiekitConfig, request),
      };

      // Session
      request.app.locals.session = request.session;

      return next();
    } catch (error) {
      return next(error);
    }
  };
