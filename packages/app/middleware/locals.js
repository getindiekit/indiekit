import {client} from '../config/database.js';
import {ApplicationModel} from '../models/application.js';
import {PublicationModel} from '../models/publication.js';
import {GithubModel} from '../models/github.js';
import {GitlabModel} from '../models/gitlab.js';
import publicationConfigService from '../services/publication-config.js';

const applicationModel = new ApplicationModel(client);
const publicationModel = new PublicationModel(client);
const githubModel = new GithubModel(client);
const gitlabModel = new GitlabModel(client);

export const locals = async (request, response, next) => {
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
