import process from 'node:process';
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {Indiekit} from '@indiekit/indiekit';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {GithubStore} from '@indiekit/store-github';
import {MastodonSyndicator} from '@indiekit/syndicator-mastodon';
import {TwitterSyndicator} from '@indiekit/syndicator-twitter';

// New indiekit instance
const indiekit = new Indiekit();

// Configure publication preset
const jekyll = new JekyllPreset();

// Configure content store
const github = new GithubStore({
  user: process.env.GITHUB_USER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH,
  token: process.env.GITHUB_TOKEN,
});

const mastodon = new MastodonSyndicator({
  checked: true,
  forced: true,
  url: process.env.MASTODON_URL,
  user: process.env.MASTODON_USER,
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
});

const twitter = new TwitterSyndicator({
  checked: true,
  forced: true,
  user: process.env.TWITTER_USER,
  apiKey: process.env.TWITTER_API_KEY,
  apiKeySecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Application settings
indiekit.set('application.mongodbUrl', process.env.MONGODB_URL);

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', github);
indiekit.set('publication.syndicationTargets', [twitter, mastodon]);
indiekit.set('publication.timeZone', process.env.TZ ? process.env.TZ : 'UTC');

// Server
const server = indiekit.server();

export default server;
