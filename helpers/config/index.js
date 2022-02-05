import process from 'node:process';
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import cookieSession from 'cookie-session';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Indiekit} from '@indiekit/indiekit';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {GithubStore} from '@indiekit/store-github';
import {TwitterSyndicator} from '@indiekit/syndicator-twitter';

const defaultOptions = {
  locale: 'en',
  useDatabase: true,
  useSyndicator: true,
};

export const testConfig = async options => {
  options = {...defaultOptions, ...options};

  // Configure MongoDb
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  // New indiekit instance
  const indiekit = new Indiekit();

  // Configure publication preset
  const jekyll = new JekyllPreset();

  // Configure content store
  const github = new GithubStore({
    token: 'abc123',
    user: 'username',
    repo: 'repo',
  });

  // Configure note post type with date-less URL for easier testing
  const postTypes = [{
    type: 'note',
    name: 'Note',
    post: {
      path: 'src/content/notes/{slug}.md',
      url: 'notes/{slug}/',
    },
  }];

  // Configure syndication targets
  const twitter = new TwitterSyndicator({
    checked: true,
    user: 'username',
    apiKey: 'abc123',
    apiKeySecret: 'abc123',
    accessToken: 'abc123',
    accessTokenSecret: 'abc123',
  });

  // Application settings
  indiekit.set('application.locale', options.locale);
  indiekit.set('application.name', 'Test config');
  indiekit.set('application.sessionMiddleware', cookieSession({
    name: 'test',
    secret: process.env.TEST_SESSION_SECRET,
  }));

  if (options.useDatabase) {
    indiekit.set('application.mongodbUrl', mongodbUrl);
  }

  // Publication settings
  indiekit.set('publication.me', process.env.TEST_PUBLICATION_URL);
  indiekit.set('publication.preset', jekyll);
  indiekit.set('publication.postTypes', postTypes);
  indiekit.set('publication.store', github);
  indiekit.set('publication.syndicationTargets', options.useSyndicator
    ? [twitter]
    : [],
  );
  indiekit.set('publication.timeZone', 'UTC');

  const indiekitConfig = await indiekit.bootstrap();

  return indiekitConfig;
};
