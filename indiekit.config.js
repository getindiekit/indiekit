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

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.storeId', 'github');
indiekit.set('publication.configPresetId', 'jekyll');
indiekit.set('publication.config.categories', {
  url: 'https://paulrobertlloyd.com/categories/index.json'
});

// TODO: User configured post types (with correct deep merge)
// TODO: User configured post type template locations

// Register extensions
indiekit.addStore(githubStore);

// Server
const server = indiekit.server();

export default server;
