import * as applicationModel from '../models/application.js';
import * as publicationModel from '../models/publication.js';
import * as githubModel from '../models/github.js';
import * as gitlabModel from '../models/gitlab.js';
import publicationConfigService from '../services/publication-config.js';

export default async (request, response, next) => {
  const url = `${request.protocol}://${request.headers.host}`;

  try {
    // Application
    const application = await applicationModel.getAll();
    application.url = url;
    application.cssPath = `${url}/assets/app.css`;
    response.locals.application = application;

    // Publication
    const publication = await publicationModel.getAll();
    publication.config = publicationConfigService(publication, request);
    response.locals.publication = publication;

    // Content hosts
    response.locals.github = await githubModel.getAll();
    response.locals.gitlab = await gitlabModel.getAll();
  } catch (error) {
    /* c8 ignore next 2 */
    return next(error);
  }

  next();
};
