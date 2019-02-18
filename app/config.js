module.exports = {
  name: 'IndieKit',
  port: process.env.PORT || 3000,
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
