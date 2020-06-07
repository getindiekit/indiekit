import {client} from '../config/database.js';
import {ApplicationModel} from '../models/application.js';
import {PublicationModel} from '../models/publication.js';
import {GithubModel} from '../models/github.js';
import {GitlabModel} from '../models/gitlab.js';
import {getHost} from '../services/host.js';
import {getMediaEndpoint} from '../services/publication.js';
import {getNavigation} from '../services/navigation.js';

export const locals = async (request, response, next) => {
  const url = `${request.protocol}://${request.headers.host}`;
  const {session} = request;

  try {
    // Application settings
    const applicationModel = new ApplicationModel(client);
    const application = await applicationModel.getAll();
    application.url = url;
    application.navigation = getNavigation(application.locale, session.token);
    response.locals.application = application;

    // Publication settings
    const publicationModel = new PublicationModel(client);
    const publication = await publicationModel.getAll();
    publication.config = getMediaEndpoint(publication, request);
    response.locals.publication = publication;

    // GitHub content host options
    const githubModel = new GithubModel(client);
    response.locals.github = await githubModel.getAll();

    // GitLab content host options
    const gitlabModel = new GitlabModel(client);
    response.locals.gitlab = await gitlabModel.getAll();

    // Content host
    const {hostId} = publication;
    const hostOptions = response.locals[hostId];
    response.locals.host = await getHost(hostId, hostOptions);
  } catch (error) {
    return next(error);
  }

  next();
};
