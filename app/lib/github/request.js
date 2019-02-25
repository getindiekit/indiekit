const fetch = require('node-fetch');

const appConfig = require(__basedir + '/config.js');

/**
 * Makes GitHub request with amended options
 *
 * @memberof github
 * @module request
 * @param {Object} args Arguments to amened
 * @return {Promise} Fetch request to GitHub API
 */
module.exports = async args => {
  const url = `https://api.github.com/repos/${appConfig.github.user}/${appConfig.github.repo}/contents/${args.path}`;
  const method = args.method || 'get';
  const options = {
    method,
    headers: {
      'content-type': 'application/vnd.github.v3+json; charset=UTF-8',
      authorization: `token ${appConfig.github.token}`,
      'User-Agent': `${appConfig.name}`
    }
  };

  if (method !== 'get') {
    const body = {
      message: null,
      content: null,
      branch: appConfig.github.branch,
      path: null
    };

    if (args.message) {
      body.message = args.message;
    }

    if (args.content) {
      body.content = args.content;
    }

    if (args.path) {
      body.path = args.path;
    }

    if (args.sha) {
      body.sha = args.sha;
    }

    options.body = JSON.stringify(body);
  }

  try {
    const request = await fetch(url, options);
    return await request.json();
  } catch (error) {
    throw new Error(error.message);
  }
};
