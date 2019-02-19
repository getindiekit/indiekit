module.exports = {
  name: 'IndieKit',
  port: process.env.PORT || 3000,
  cache: {
    dir: __basedir + '/.cache',
    'max-age': 60 // 86400
  },
  config: {
    path: process.env.CONFIG_PATH || 'indiekit.json',
    file: 'config.json'
  },
  github: {
    user: process.env.GITHUB_USER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || 'master',
    token: process.env.GITHUB_TOKEN
  },
  indieauth: {
    'token-endpoint': process.env.TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token'
  }
};
