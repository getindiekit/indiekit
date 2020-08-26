import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {Indiekit} from './packages/indiekit/index.js';
import {GithubStore} from './packages/store-github/index.js';

// New indiekit instance
const indiekit = new Indiekit();

// Configure content store
const githubStore = new GithubStore({
  user: process.env.GITHUB_USER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH,
  token: process.env.GITHUB_TOKEN
});

// Register extensions
indiekit.addStore(githubStore);

// Application settings
indiekit.set('application.locale', process.env.LOCALE);

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.storeId', 'github');
indiekit.set('publication.config.categories.url', 'http://paulrobertlloyd.com/categories/index.json');

// Server
const server = indiekit.server();

export default server;
