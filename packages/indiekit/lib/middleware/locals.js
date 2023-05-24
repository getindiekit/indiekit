import { getEndpoints } from "../endpoints.js";
import { getNavigation } from "../navigation.js";
import { getUrl } from "../utils.js";

/**
 * Expose configuration to frontend templates and plug-ins
 * @param {object} indiekitConfig - Indiekit configuration
 * @returns {import("express").RequestHandler} Next middleware
 */
export const locals = (indiekitConfig) =>
  function (request, response, next) {
    try {
      const { application, publication } = indiekitConfig;

      // Application
      request.app.locals.application = application;

      // Application locale
      application.localeUsed = request.getLocale();

      // Application URL
      application.url = application.url || getUrl(request);

      // Application navigation
      // Only update if serving HTML to prevent wrong session link being shown
      if (request.accepts("html")) {
        application.navigation = getNavigation(application, request, response);
      }

      // Application endpoints
      request.app.locals.application = {
        ...application,
        ...getEndpoints(application, request),
      };

      // Publication
      request.app.locals.publication = publication;

      // Persist scope and token
      request.app.locals.scope =
        request.app.locals.scope || request.session.scope;
      request.app.locals.token =
        request.app.locals.token || request.session.access_token;

      return next();
    } catch (error) {
      return next(error);
    }
  };
