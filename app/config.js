module.exports = {
  name: 'IndieKit',
  port: process.env.PORT || 3000,
  cache: {
    dir: __basedir + '/../.cache',
    'max-age': process.env.INDIEKIT_CACHE_EXPIRES || 86400
  },
  config: {
    path: process.env.INDIEKIT_CONFIG_PATH || 'indiekit.json',
    file: 'config.json'
  },
  history: {
    file: 'history.json'
  },
  url: process.env.INDIEKIT_URL || console.error('Missing INDIEKIT_URL'),
  github: {
    token: process.env.GITHUB_TOKEN || console.error('Missing GITHUB_TOKEN'),
    user: process.env.GITHUB_USER || console.error('Missing GITHUB_USER'),
    repo: process.env.GITHUB_REPO || console.error('Missing GITHUB_REPO'),
    branch: process.env.GITHUB_BRANCH || 'master'
  },
  indieauth: {
    'token-endpoint': process.env.INDIEAUTH_TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token'
  }
};
