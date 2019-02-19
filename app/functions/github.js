const fetch = require('node-fetch');

const appConfig = require(__basedir + '/app/config.js');
const utils = require(__basedir + '/app/functions/utils.js');

const repoContentUrl = `https://api.github.com/repos/${appConfig.github.user}/${appConfig.github.repo}/contents/`;

/**
 * Makes GitHub request with amended options
 *
 * @private
 * @param {Object} args Arguments to amened
 * @return {Promise} Fetch request to GitHub API
 */
const requestWithOptions = async function (args) {
  const url = `${repoContentUrl}/${args.path}`;
  const method = args.method || 'put';
  let body;

  if (method !== 'get') {
    body = {
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

    body = JSON.stringify(body);
  }

  const options = {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `token ${appConfig.github.token}`,
      'User-Agent': `${appConfig.name}`
    },
    body
  };

  return fetch(url, options);
};

/**
 * Creates a new file in a GitHub repository.
 * https://developer.github.com/v3/repos/contents/#create-a-file
 *
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} postType Microformats post type
 * @return {String} GitHub HTTP response
 */
exports.createFile = async function (path, content, postType) {
  path = utils.normalizePath(path);
  return requestWithOptions({
    message: `:robot: New ${postType} created via ${appConfig.name}`,
    content: Buffer.from(content).toString('base64'),
    path
  }).then(response => {
    return response.json();
  }).then(json => {
    return json;
  }).catch(error => {
    console.error('github.createFile', error);
  });
};

exports.getContents = async function (path) {
  path = utils.normalizePath(path);

  return requestWithOptions({
    path,
    method: 'get'
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
  }).then(body => {
    return Buffer.from(body.content, 'base64').toString('utf8');
  }).catch(error => {
    console.error('github.getContents', error);
  });
};
