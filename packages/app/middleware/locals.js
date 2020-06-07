import {settings} from '../config/settings.js';
import {getMediaEndpoint} from '../services/publication.js';
import {getNavigation} from '../services/navigation.js';

/**
 * Expose settings to frontend templates
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP request
 * @param {Function} next Next middleware
 * @returns {Function} Next middleware
 */
export const locals = async (request, response, next) => {
  try {
    const {application, publication, github, gitlab} = await settings();

    // Application settings
    application.url = `${request.protocol}://${request.headers.host}`;
    application.navigation = getNavigation(application.locale, request.session.token);
    response.locals.application = application;

    // Publication settings
    publication.config = getMediaEndpoint(publication, request);
    response.locals.publication = publication;

    // Content host settings
    response.locals.github = github;
    response.locals.gitlab = gitlab;
  } catch (error) {
    return next(error);
  }

  next();
};
