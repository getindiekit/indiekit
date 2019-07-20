require('dotenv').config();

const pkg = require(process.env.PWD + '/package');

const config = module.exports;

// Server
config.name = 'IndieKit';
config.version = pkg.version;
config.description = pkg.description;
config.repository = pkg.repository;
config.port = process.env.PORT || 3000;

// Locale
config.locale = process.env.INDIEKIT_LOCALE || 'en-GB';

// Cache
config.cache = {
  dir: process.env.PWD + '/.cache',
  'max-age': process.env.INDIEKIT_CACHE_EXPIRES || 86400
};

// Data store
config.data = {
  dir: process.env.PWD + '/.data',
  'max-age': process.env.INDIEKIT_DATA_EXPIRES || 86400
};

// IndieAuth
config.indieauth = {
  'token-endpoint': process.env.INDIEAUTH_TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token'
};

// Publication
config.url = process.env.INDIEKIT_URL;
config['pub-config'] = process.env.INDIEKIT_CONFIG_PATH;

// Github
config.github = {
  token: process.env.GITHUB_TOKEN || console.warn('Missing GITHUB_TOKEN'),
  user: process.env.GITHUB_USER || console.warn('Missing GITHUB_USER'),
  repo: process.env.GITHUB_REPO || console.warn('Missing GITHUB_REPO'),
  branch: process.env.GITHUB_BRANCH || 'master'
};

// Timber
config.timber = {
  token: process.env.TIMBER_TOKEN || console.info('Missing TIMBER_TOKEN'),
  source: process.env.TIMBER_SOURCE || console.info('Missing TIMBER_SOURCE')
};

if (process.env.NODE_ENV === 'test') {
  config.port = null;
  config.github = {
    token: 'abc123',
    user: 'username',
    repo: 'repo',
    branch: 'master'
  };
}
