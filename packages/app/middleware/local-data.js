import * as applicationController from '../controllers/application.js';
import * as publicationController from '../controllers/publication.js';
import * as githubController from '../controllers/github.js';
import * as gitlabController from '../controllers/gitlab.js';
import publicationConfigService from '../services/publication-config.js';

export default async (request, response, next) => {
  const url = `${request.protocol}://${request.headers.host}`;

  try {
    // Application
    const application = await applicationController.read();
    application.url = url;
    application.cssPath = `${url}/assets/app.css`;
    response.locals.application = application;

    // Publication
    const publication = await publicationController.read();
    publication.config = publicationConfigService(publication, request);
    response.locals.publication = publication;

    // Content hosts
    response.locals.github = await githubController.read();
    response.locals.gitlab = await gitlabController.read();
  } catch (error) {
    /* c8 ignore next 2 */
    return next(error);
  }

  next();
};
