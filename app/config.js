require('dotenv').config();

const pkg = require(process.env.PWD + '/package');

const config = module.exports;

// Server
config.name = 'IndieKit';
config.version = pkg.version;
config.description = pkg.description;
config.repository = pkg.repository;
config.port = (process.env.NODE_ENV === 'test') ?
  null : // Don’t assign a port when running concurrent tests
  process.env.PORT || 3000;

// Customisation
config.locale = process.env.INDIEKIT_LOCALE || 'en-GB';
config.themeColor = '#f60';

// Cache
config.cache = {
  ttl: process.env.INDIEKIT_CACHE_EXPIRES || 86400
};

// Data store
config.data = {
  dir: process.env.PWD + '/.data',
  ttl: process.env.INDIEKIT_DATA_EXPIRES || 86400
};

// IndieAuth
config.indieauth = {
  'token-endpoint': process.env.INDIEAUTH_TOKEN_ENDPOINT
};

// Publication
config.pub = {
  url: process.env.INDIEKIT_URL,
  config: process.env.INDIEKIT_CONFIG_PATH
};

// Github
config.github = {
  token: process.env.GITHUB_TOKEN || console.warn('Missing GITHUB_TOKEN'),
  user: process.env.GITHUB_USER || console.warn('Missing GITHUB_USER'),
  repo: process.env.GITHUB_REPO || console.warn('Missing GITHUB_REPO'),
  branch: process.env.GITHUB_BRANCH || 'master'
};

// Timber
config.timber = {
  token: process.env.TIMBER_TOKEN,
  source: process.env.TIMBER_SOURCE
};
