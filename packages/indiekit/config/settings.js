import {client} from './database.js';
import {ApplicationModel} from '../models/application.js';
import {PublicationModel} from '../models/publication.js';
import {GithubModel} from '../models/github.js';
import {GitlabModel} from '../models/gitlab.js';
import {getStore} from '../services/store.js';

const applicationModel = new ApplicationModel(client);
const publicationModel = new PublicationModel(client);
const githubModel = new GithubModel(client);
const gitlabModel = new GitlabModel(client);

export const settings = async () => {
  // Application settings
  const application = await applicationModel.getAll();

  // Publication settings
  const publication = await publicationModel.getAll();

  // GitHub content store options
  const github = await githubModel.getAll();

  // GitLab content store options
  const gitlab = await gitlabModel.getAll();

  // Content store
  const {storeId} = publication;
  const storeOptions = [storeId];
  const store = await getStore(storeId, storeOptions);

  return {
    application,
    publication,
    github,
    gitlab,
    store
  };
};
