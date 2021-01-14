import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import supertest from 'supertest';
import {Indiekit} from '../../packages/indiekit/index.js';
import {serverConfig} from '../../packages/indiekit/config/server.js';
import {JekyllPreset} from '../../packages/preset-jekyll/index.js';
import {GithubStore} from '../../packages/store-github/index.js';
import {TwitterSyndicator} from '../../packages/syndicator-twitter/index.js';

// New indiekit instance
const indiekit = new Indiekit();

// Configure publication preset
const jekyll = new JekyllPreset();

// Configure content store
const github = new GithubStore({
  token: 'abc123',
  user: 'user',
  repo: 'repo'
});

// Configure syndication targets
const twitter = new TwitterSyndicator({
  checked: true,
  forced: true,
  user: 'user',
  apiKey: 'abc123',
  apiKeySecret: 'abc123',
  accessToken: 'abc123',
  accessTokenSecret: 'abc123'
});

// Application settings
indiekit.set('application.mongodbUrl', process.env.TEST_MONGODB_URL);

// Publication settings
indiekit.set('publication.me', process.env.TEST_PUBLICATION_URL);
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', github);
indiekit.set('publication.syndicationTargets', [twitter]);
indiekit.set('publication.timeZone', 'UTC');

export const server = (async () => {
  const indiekitConfig = indiekit.getConfig();
  const server = supertest(serverConfig(await indiekitConfig));
  return server;
})();
