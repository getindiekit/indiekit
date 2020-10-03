import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {Indiekit} from './packages/indiekit/index.js';
import {JekyllPreset} from './packages/preset-jekyll/index.js';
import {GithubStore} from './packages/store-github/index.js';
import {InternetArchiveSyndicator} from './packages/syndicator-internet-archive/index.js';

// New indiekit instance
const indiekit = new Indiekit();

// Configure publication preset
const jekyll = new JekyllPreset();

// Configure content store
const github = new GithubStore({
  user: process.env.GITHUB_USER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH,
  token: process.env.GITHUB_TOKEN
});

// Configure Internet Archive syndicator
const internetArchive = new InternetArchiveSyndicator({
  accessKey: process.env.ARCHIVE_ACCESS_KEY,
  secret: process.env.ARCHIVE_SECRET
});

// Application settings
indiekit.set('application.mongodbUrl', process.env.MONGODB_URL);

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', github);
indiekit.set('publication.timeZone', process.env.TZ ? process.env.TZ : 'UTC');
indiekit.set('publication.syndicationTargets', [internetArchive]);

// Server
const server = indiekit.server();

export default server;
