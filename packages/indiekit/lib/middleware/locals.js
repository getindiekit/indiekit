import { getEndpoints } from "../publication.js";
import { getNavigation } from "../navigation.js";
import { getUrl } from "../utils.js";

/**
 * Expose configuration to frontend templates and plug-ins
 *
 * @param {object} indiekitConfig Indiekit configuration
 * @returns {Function} Next middleware
 */
export const locals = (indiekitConfig) =>
  function (request, response, next) {
    try {
      const { application, publication } = indiekitConfig;

      // Application
      application.localeUsed = request.getLocale();
      application.navigation = getNavigation(application, request, response);
      application.url = application.url || getUrl(request);
      request.app.locals.application = application;

      // Publication
      request.app.locals.publication = {
        ...publication,
        ...getEndpoints(indiekitConfig, request),
      };

      // Session
      response.locals.session = request.session;

      next();
    } catch (error) {
      next(error);
    }
  };
