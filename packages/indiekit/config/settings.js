import {client} from './database.js';
import {ApplicationModel} from '../models/application.js';
import {PublicationModel} from '../models/publication.js';
import {GithubModel} from '../models/github.js';
import {GitlabModel} from '../models/gitlab.js';
import {getHost} from '../services/host.js';

const applicationModel = new ApplicationModel(client);
const publicationModel = new PublicationModel(client);
const githubModel = new GithubModel(client);
const gitlabModel = new GitlabModel(client);

export const settings = async () => {
  // Application settings
  const application = await applicationModel.getAll();

  // Publication settings
  const publication = await publicationModel.getAll();

  // GitHub content host options
  const github = await githubModel.getAll();

  // GitLab content host options
  const gitlab = await gitlabModel.getAll();

  // Content host
  const {hostId} = publication;
  const hostOptions = [hostId];
  const host = await getHost(hostId, hostOptions);

  return {
    application,
    publication,
    github,
    gitlab,
    host
  };
};
