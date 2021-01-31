import {getNavigation} from '../navigation.js';

/**
 * Expose config to frontend templates
 *
 * @param {object} indiekitConfig Indiekit config
 * @returns {Function} Next middleware
 */
export const locals = indiekitConfig => {
  return async function (request, response, next) {
    try {
      const {application, publication} = indiekitConfig;

      // Application
      application.localeUsed = request.getLocale();
      application.navigation = getNavigation(application, request, response);
      application.url = `${request.protocol}://${request.headers.host}`;
      response.locals.application = application;

      // Publication
      response.locals.publication = publication;

      // Session
      response.locals.session = request.session;

      next();
    } catch (error) {
      next(error);
    }
  };
};
