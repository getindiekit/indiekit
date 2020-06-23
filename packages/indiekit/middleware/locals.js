import {getNavigation} from '../lib/navigation.js';
import {getMediaEndpoint} from '../lib/publication.js';

/**
 * Expose Indiekit config to frontend templates
 *
 * @param {object} indiekitConfig IndieKit config
 * @returns {Function} Next middleware
 */
export const locals = indiekitConfig => {
  return async function (request, response, next) {
    try {
      const {application, publication} = indiekitConfig;

      // Application
      application.url = `${request.protocol}://${request.headers.host}`;
      application.navigation = getNavigation(application.locale, request.session.token);
      response.locals.application = application;

      // Publication
      publication.config = getMediaEndpoint(publication, request);
      response.locals.publication = publication;
    } catch (error) {
      return next(error);
    }

    next();
  };
};
