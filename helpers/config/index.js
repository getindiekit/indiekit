import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Indiekit} from '../../packages/indiekit/index.js';
import {JekyllPreset} from '../../packages/preset-jekyll/index.js';
import {GithubStore} from '../../packages/store-github/index.js';
import {TwitterSyndicator} from '../../packages/syndicator-twitter/index.js';

export const indiekitConfig = (async () => {
  // Configure MongoDb
  const mongod = new MongoMemoryServer();
  const mongodbUrl = await mongod.getUri();

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

  // Configure note post type with date-less URL for easier testing
  const postTypes = [{
    type: 'note',
    name: 'Note',
    post: {
      path: 'src/content/notes/{slug}.md',
      url: 'notes/{slug}/'
    }
  }];

  // Configure syndication targets
  const twitter = new TwitterSyndicator({
    checked: true,
    user: 'user',
    apiKey: 'abc123',
    apiKeySecret: 'abc123',
    accessToken: 'abc123',
    accessTokenSecret: 'abc123'
  });

  // Application settings
  indiekit.set('application.mongodbUrl', mongodbUrl);

  // Publication settings
  indiekit.set('publication.me', process.env.TEST_PUBLICATION_URL);
  indiekit.set('publication.preset', jekyll);
  indiekit.set('publication.postTypes', postTypes);
  indiekit.set('publication.store', github);
  indiekit.set('publication.syndicationTargets', [twitter]);
  indiekit.set('publication.timeZone', 'UTC');

  const indiekitConfig = await indiekit.getConfig();

  return indiekitConfig;
})();
